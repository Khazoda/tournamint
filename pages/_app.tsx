import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'

let body: HTMLBodyElement | null = null
let localStorage: Storage

function MyApp({ Component, pageProps }: AppProps) {
  const [is_dark, setIsDark] = useState<boolean>()

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
  }, [])
  return (
    <div className="">
      <Navbar></Navbar>
      <Component is_dark={is_dark} setDark={setDark} {...pageProps} />
    </div>
  )
}

export default MyApp
