import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
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

  // SHAPES
  interface ICardStatistics {
    icon: string
    type: string
    value: number
  }
  // STATE
  const [cardStatistics, setCardStatistics] = useState<Array<ICardStatistics>>([
    {
      icon: 'hi',
      type: 'hey',
      value: 5,
    },
  ])

  useEffect(() => {
    // Populate cardStatistics
    for (let index = 0; index < 4; index++) {
      if (cardStatistics.length < 5) {
        setCardStatistics((statistics) => [
          ...statistics,
          {
            icon: 'sus',
            type: 'sus',
            value: Math.round(Math.random() * 54),
          },
        ])
      }
    }
  }, [])

  return (
    <div className=" h-full min-h-screen px-4 pt-24 pb-4">
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid h-full w-full grid-cols-1 items-center text-center md:grid-cols-[_minmax(100px,1fr),300px] md:grid-rows-[180px,_minmax(100px,1fr)] ">
        {/* Left Half */}
        <div
          id="top_left"
          className="ml-4 flex justify-between overflow-x-auto md:ml-0"
        >
          {cardStatistics.map((card) => {
            return (
              <div className="mr-4 flex h-40 w-40 min-w-[10rem] flex-col justify-center rounded-md bg-emerald-700 last:mr-0">
                <span>{card.icon || '[Icon]'}</span>
                <span>{card.value || '[Value]'}</span>
                <span>{card.type || '[Statistic Name]'}</span>
              </div>
            )
          })}
        </div>

        <div
          id="bottom_left"
          className="row-start-2 hidden h-0 w-0 bg-pink-800 md:block md:h-full md:w-full"
        >
          <div className=""> Tournament Bracket</div>
          {displayName} {biography} {ign}
        </div>
        {/* Right Half */}
        <div
          id="top_right"
          className=" md:cols-end-2 row-start-1 row-end-1 ml-4 mb-2 flex h-min flex-col gap-3 self-start rounded-md bg-white-600 px-2 py-2 dark:bg-white-900 md:col-start-2 "
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
          id="bottom_right"
          className=" ml-4 flex h-full flex-col gap-3 rounded-md bg-white-500 px-2 py-2 dark:bg-white-900"
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
