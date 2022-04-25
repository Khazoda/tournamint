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
    <div className=" min-h-screen py-24">
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid w-full grid-cols-[200px_minmax(100px,_1fr)_200px] justify-between text-center ">
        <div id="left" className="flex h-screen flex-col gap-3 bg-red-300 px-2">
          <Button text="Create Tournament"></Button>
          <Button text="Join Tournament"></Button>
        </div>
        <div id="center">
          {displayName} {biography} {ign}
        </div>

        <div id="right">among us</div>
      </main>
    </div>
  )
}

export default Home
