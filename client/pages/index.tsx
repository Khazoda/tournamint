import axios from 'axios'
import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'

let body: HTMLBodyElement | null = null
let localStorage: Storage
export interface Props {
  is_dark: boolean
  setDark: Function
}
const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props

  const [searchQuery, setSearchQuery] = useState('')
  const [userData, setUserData] = useState<any>([])

  function getUserData(event?: Event) {
    axios
      .get('http://localhost:4000/userData', {
        params: { username: searchQuery },
      })
      .then(function (response) {
        setUserData(response.data)
        console.log(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  return (
    <div className=" min-h-screen py-24">
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid w-full grid-cols-[200px_minmax(900px,_1fr)_200px] justify-between text-center ">
        <div id="left" className="flex h-screen flex-col gap-3 bg-red-300 px-2">
          <Button text="Create Tournament"></Button>
          <Button text="Join Tournament"></Button>
        </div>
        <div id="center">
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white-600 outline-black-400 dark:bg-black-400"
          />
          <button onClick={(e) => getUserData()}>Search</button>
        </div>

        <div id="right">
          {userData.length !== 0 && (
            <>
              <div className="relative h-20 w-20">
                <Image
                  src={
                    'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                    userData.profileIconId +
                    '.png'
                  }
                  alt="Profile picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                ></Image>
              </div>
              <div>
                {userData.name} Level: {userData.summonerLevel}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
