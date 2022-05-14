import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'
import TeamTidbit from '../components/common/TeamTidbit'

import { default_card_statistics } from '../globals/seed_data'
import MatchTidbit from '../components/common/MatchTidbit'
import TournamentDisplay from '../components/common/TournamentDisplay'

let body: HTMLBodyElement | null = null
let localStorage: Storage
export interface Props {
  is_dark: boolean
  setDark: Function
}
const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props
  const { displayName, biography, ign, setUserDetails, statistics } = useUser()

  // SHAPES
  interface ICardStatistics {
    icon: React.ReactElement
    title: string
    type: string
    value_key: string
  }
  // STATE
  const [cardStatistics, setCardStatistics] = useState<Array<ICardStatistics>>(
    []
  )

  useEffect(() => {
    // Populate cardStatistics
    setCardStatistics(default_card_statistics)
  }, [])

  return (
    <div
      id="wrapper"
      className=" grid h-full  min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto grid h-full w-full max-w-[1500px] items-center gap-4 text-center md:grid-cols-[_minmax(100px,1fr),300px] md:grid-rows-[180px,_minmax(100px,1fr)] md:gap-2 ">
        {/* Left Half */}
        <div
          id="top_left"
          className="row-start-2 row-end-2 ml-0 flex h-full items-start justify-between overflow-x-auto scrollbar-hide md:row-start-1 md:row-end-1"
        >
          {cardStatistics.map((card) => {
            const valuekey = card.value_key
            return (
              <div className="mr-4 flex h-[164px] w-[164px] min-w-[164px] flex-col justify-center rounded-md border-2 border-green-200 bg-green-100 last:mr-0 dark:border-black-500  dark:bg-black-600">
                <span className="mx-auto mt-2 h-10 w-10">
                  {card.icon || '[Icon]'}
                </span>
                <span className="mb-auto text-lg font-semibold">
                  {card.title}
                </span>
                <span className="ml-2 self-start text-2xl">
                  {(statistics as any)[valuekey] || '[Value]'}
                </span>
                <span className=" ml-2 mb-2 self-start">
                  {card.type || '[Statistic Name]'}
                </span>
              </div>
            )
          })}
        </div>

        <div
          id="bottom_left"
          className="relative row-start-2 hidden h-0 w-0 flex-col justify-center rounded-md bg-green-100 dark:bg-black-600 md:flex md:h-full md:w-full"
        >
          <div className="absolute left-1/2 top-4 -translate-x-1/2 pt-2 text-2xl">
            ( Tournament Bracket Name)
          </div>
          <TournamentDisplay></TournamentDisplay>
          {/* {displayName} {biography} {ign} */}
        </div>
        {/* Right Half */}
        <div
          id="top_right"
          className=" md:cols-end-2 row-start-1 row-end-1 ml-0 mb-2 flex h-min flex-col gap-3 self-start rounded-md bg-green-100 px-2 py-2 dark:bg-black-600 md:col-start-2 md:ml-4 "
        >
          <div className=" flex flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 md:flex-col">
            <Button
              text="Create Tournament"
              noMargin
              type="positive"
              className="text-white-500 drop-shadow-sm"
            ></Button>
            <div className="flex w-[150%] flex-col gap-2 rounded-md bg-emerald-400 p-2 drop-shadow-sm dark:bg-emerald-800 md:w-auto">
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
          className=" ml-0 flex h-full flex-col gap-3 rounded-md bg-green-100 px-2 py-2 dark:bg-black-600 md:ml-4"
        >
          <h2 className="text-lg">Upcoming Matches</h2>
          <span className="mx-auto h-0.5 w-10 rounded-md bg-emerald-400"></span>
          <div className="border-l-2 border-blue-400 px-2 ">
            <MatchTidbit></MatchTidbit>
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
