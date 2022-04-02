import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import axios from 'axios'
import { StoreContextWrapper } from '../store'

let body: HTMLBodyElement | null = null
let localStorage: Storage

function MyApp({ Component, pageProps }: AppProps) {
  const [is_dark, setIsDark] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>([])

  // Light/Dark theme switching function
  const setDark = (val: boolean) => {
    if (body != null) {
      // Set Dark
      if (val == true) {
        body.classList.add('dark')
        body.classList.remove('light')
        setIsDark(true)
        localStorage.theme = 'dark'
      }

      //Set Light
      if (val == false) {
        body.classList.add('light')
        body.classList.remove('dark')
        setIsDark(false)
        localStorage.theme = 'light'
      }
    }
  }

  // Is called on rerenders, but not state changes
  useEffect(() => {
    body = document.querySelector('body')
    localStorage = window.localStorage

    // Initially set theme to light
    if (body != null) {
      body.classList.add('light')
    }
    // If theme saved in LocalStorage is dark, swap client theme
    if (
      body != null &&
      (localStorage.theme === 'dark' || !('theme' in localStorage))
    ) {
      setDark(true)
    }

    // INITIAL RIOT API DATA FETCH
    refreshUserInfo()
  }, [])

  const refreshUserInfo = () => {
    if (localStorage?.userDetails != null) {
      const username: any = JSON.parse(localStorage?.userDetails).username
      const biography: any = JSON.parse(localStorage?.userDetails).biography
      const ign: any = JSON.parse(localStorage?.userDetails).ign

      axios
        .get('http://localhost:4000/userData', {
          params: { ign: ign },
        })
        .then(function (response) {
          // Initialize Store
          // store = new Store(username, biography, ign)
          // console.log(store)

          setUserData(response.data)
          console.log(response.data)
          // Return promise
          return new Promise((resolve) => {
            resolve('resolved')
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
  return (
    <div className=" m-0 bg-white-100 text-black-800 dark:bg-black-700 dark:text-white-200">
      <StoreContextWrapper>
        <Navbar is_dark={is_dark} setDark={setDark}></Navbar>
        <Component
          localStorage={localStorage}
          userData={userData}
          refreshUserInfo={refreshUserInfo}
          {...pageProps}
        />
      </StoreContextWrapper>
    </div>
  )
}

export default MyApp
