import axios from 'axios'
import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'

let body: HTMLBodyElement | null = null
let localStorage: Storage
export interface Props {
  is_dark: boolean
  setDark: Function
}
const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props
  const { displayName, biography, ign, setUserDetails } = useUser()

  return (
    <div className=" h-full min-h-screen py-24">
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid h-full w-full min-w-[320px] grid-rows-[200px_minmax(100px,_1fr)_200px] justify-center text-center sm:grid-cols-[200px_minmax(100px,_1fr)_200px] ">
        <div
          id="left"
          className="mx-2 flex h-min flex-col gap-3 rounded-md bg-emerald-900 p-2 sm:ml-4"
        >
          <Button
            text="Create Tournament"
            noMargin
            type="positive"
            className="drop-shadow-sm"
          ></Button>
          <div className="flex flex-col gap-2 rounded-md bg-emerald-800 p-2 drop-shadow-sm">
            <Button text="Join Tournament" noMargin type="neutral"></Button>
            <Button text="Find Tournament" noMargin type="neutral"></Button>
          </div>
        </div>
        <div id="center" className="flex flex-col items-center">
          {displayName} {biography} {ign}
          <img src="https://cdn.dribbble.com/users/1192538/screenshots/4876120/2.png?compress=1&resize=400x300"></img>
        </div>
        <div
          id="right"
          className="row-span-3 mx-2 flex h-full flex-col gap-3 rounded-md bg-emerald-900 px-2 py-2 sm:mr-4"
        >
          <h2>Upcoming Tournaments</h2>
        </div>
      </main>
    </div>
  )
}

export default Home
