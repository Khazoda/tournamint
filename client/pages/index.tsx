import axios from 'axios'
import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'
import TeamTidbit from '../components/common/TeamTidbit'

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

      <main className="grid h-full w-full min-w-[320px] grid-rows-[200px_minmax(100px,_1fr)_200px] justify-center text-center sm:grid-cols-[200px_minmax(100px,_1fr)_350px] ">
        {/* Left Trident */}
        <div
          id="left"
          className="mx-2 flex h-min flex-col gap-3 rounded-md "
        ></div>
        {/* Center Trident */}
        <div id="center" className="flex flex-col items-center">
          <div className="flex flex-col">
            <div className="flex flex-row gap-5">
              <div className="flex h-36 w-36 flex-col justify-center rounded-md bg-emerald-700">
                <span>Icon</span>
                <span>Value</span>
                <span>Statistic Name</span>
              </div>
              <div className="flex h-36 w-36 flex-col justify-center rounded-md bg-emerald-700">
                <span>Icon</span>
                <span>Value</span>
                <span>Statistic Name</span>
              </div>
              <div className="flex h-36 w-36 flex-col justify-center rounded-md bg-emerald-700">
                <span>Icon</span>
                <span>Value</span>
                <span>Statistic Name</span>
              </div>
            </div>
            <div className=""> Tournament Bracket</div>
          </div>
          {displayName} {biography} {ign}
          <img src="https://cdn.dribbble.com/users/1192538/screenshots/4876120/2.png?compress=1&resize=400x300"></img>
        </div>
        {/* Right Trident */}
        <div
          id="right"
          className="col-start-3 col-end-3 mx-2  mb-2 flex h-min flex-col gap-3 rounded-md bg-white-600 px-2 py-2 dark:bg-white-900 sm:mr-4"
        >
          <div className=" flex flex-col gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900">
            <Button
              text="Create Tournament"
              noMargin
              type="positive"
              className="text-white-500 drop-shadow-sm"
            ></Button>
            <div className="flex flex-col gap-2 rounded-md bg-emerald-400 p-2 drop-shadow-sm dark:bg-emerald-800">
              <Button
                text="Join Tournament"
                noMargin
                type="neutral"
                className="text-white-500"
              ></Button>
              <Button
                text="Find Tournament"
                noMargin
                type="neutral"
                className="text-white-500"
              ></Button>
            </div>
          </div>
        </div>
        <div
          id="right"
          className="col-start-3 col-end-3 row-span-2 mx-2 flex h-full flex-col gap-3 rounded-md bg-white-500 px-2 py-2 dark:bg-white-900 sm:mr-4"
        >
          <h2 className="text-lg">Upcoming Tournaments</h2>
          <span className="mx-auto h-0.5 w-10 rounded-md bg-emerald-400"></span>
          <div className="border-l-2 border-blue-400 px-2">
            <div className="flex h-11 flex-row gap-1">
              <TeamTidbit side="left"></TeamTidbit>
              <div className="relative h-full w-0.5 bg-transparent">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
                  VS
                </span>
              </div>
              <TeamTidbit side="right"></TeamTidbit>
            </div>
            <h4>July 15th 15:30 CEST</h4>
          </div>
          <div className="border-l-2 border-blue-400 px-2">
            <div className="flex h-11 flex-row gap-1">
              <TeamTidbit side="left"></TeamTidbit>
              <div className="relative h-full w-0.5 bg-transparent">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
                  VS
                </span>
              </div>
              <TeamTidbit side="right"></TeamTidbit>
            </div>
            <h4>July 15th 15:30 CEST</h4>
          </div>
          <div className="border-l-2 border-blue-400 px-2">
            <div className="flex h-11 flex-row gap-1">
              <TeamTidbit side="left"></TeamTidbit>
              <div className="relative h-full w-0.5 bg-transparent">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
                  VS
                </span>
              </div>
              <TeamTidbit side="right"></TeamTidbit>
            </div>
            <h4>July 15th 15:30 CEST</h4>
          </div>
          <div className="border-l-2 border-blue-400 px-2">
            <div className="flex h-11 flex-row gap-1">
              <TeamTidbit side="left"></TeamTidbit>
              <div className="relative h-full w-0.5 bg-transparent">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
                  VS
                </span>
              </div>
              <TeamTidbit side="right"></TeamTidbit>
            </div>
            <h4>July 15th 15:30 CEST</h4>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
