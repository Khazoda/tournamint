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
import Link from 'next/link'
import { Countdown } from 'react-daisyui'

let body: HTMLBodyElement | null = null
let localStorage: Storage
export interface Props {
  is_dark: boolean
  setDark: Function
}

let carry_flag = {
  minutes: true,
  hours: true,
  days: true,
}

const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props
  const { displayName, biography, ign, statistics, team } = useUser()
  const [countdown_s, setCountdown_s] = useState<number>(3)
  const [countdown_m, setCountdown_m] = useState<number>(0)
  const [countdown_h, setCountdown_h] = useState<number>(0)
  const [countdown_d, setCountdown_d] = useState<number>(1)

  const [secondsToNextMatch, setSecondsToNextMatch] = useState(10)

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

  // Countdown logic
  const humanReadableDate = new Date(Date.UTC(2022, 8, 3, 34, 22))
  const countDownDate = humanReadableDate
  const countDownTime = countDownDate.getTime()

  var myfunc = setInterval(function () {
    var now = new Date().getTime()
    var left = countDownTime - now

    setCountdown_d(Math.floor(left / (1000 * 60 * 60 * 24)))
    setCountdown_h(
      Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    )
    setCountdown_m(Math.floor((left % (1000 * 60 * 60)) / (1000 * 60)))
    setCountdown_s(Math.floor((left % (1000 * 60)) / 1000))
  }, 1000)

  // !Deprecated, concurrency unsafe countdown logic implementation
  // // WHEN SECONDS VALUE CHANGES
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (countdown_s == 0) {
  //       setCountdown_m((m) => m - 1)
  //     }
  //     setCountdown_s((s) => (s <= 0 ? 0 : s - 1))
  //     console.log(carry_flag)
  //   }, 1000)

  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [countdown_s])

  // // WHEN MINUTES VALUE CHANGES
  // useEffect(() => {
  //   if (countdown_m <= 0) {
  //     if (carry_flag.minutes) {
  //       setCountdown_h((h) => h - 1)
  //       carry_flag.minutes = false
  //     }
  //     carry_flag.minutes = true
  //     // setCountdown_m(59)
  //   }
  //   if (countdown_s == 0) {
  //     setCountdown_s((s) => 59)
  //   }
  // }, [countdown_m])

  // // WHEN HOURS VALUE CHANGES
  // useEffect(() => {
  //   if (countdown_h <= 0) {
  //     if (carry_flag.hours) {
  //       setCountdown_d((d) => d - 1)
  //       carry_flag.hours = false
  //       setCountdown_m((m) => 59)
  //     }
  //     carry_flag.hours = true

  //     // setCountdown_h(23)
  //     if (countdown_m <= 0) {
  //       setCountdown_m((m) => 59)
  //     }
  //   }
  // }, [countdown_h])

  // // WHEN DAYS VALUE CHANGES
  // useEffect(() => {
  //   if (countdown_d <= 0) {
  //     if (carry_flag.days) {
  //       carry_flag.days = false
  //       setCountdown_h((h) => 23)
  //     }
  //     carry_flag.days = true
  //     if (countdown_h == 0) {
  //       setCountdown_h((h) => 23)
  //     }
  //   }
  // }, [countdown_d])
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
                  {(statistics as any)[valuekey]}
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
          <TournamentDisplay team={team}></TournamentDisplay>
          {/* {displayName} {biography} {ign} */}
        </div>
        {/* Right Half */}
        <div
          id="top_right"
          className=" md:cols-end-2 row-start-1 row-end-1 ml-0 mb-2 flex h-min flex-col gap-3 self-start rounded-md bg-green-100 px-2 py-2 dark:bg-black-600 md:col-start-2 md:ml-4 "
        >
          <div className=" flex flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 md:flex-col">
            <Link href="tournaments/create_tournament">
              <Button
                text="Create Tournament"
                noMargin
                type="positive"
                className="text-white-500 drop-shadow-sm"
              ></Button>
            </Link>
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
          className=" ml-0 flex h-auto flex-col gap-3 self-start rounded-md bg-green-100 px-2 py-2 pb-4 dark:bg-black-600 md:ml-4"
        >
          <h2 className="text-lg">Upcoming Match</h2>
          <span className="mx-auto h-0.5 w-10 rounded-md bg-emerald-400"></span>
          <div className="px-2 ">
            {team ? (
              <MatchTidbit
                team_1_tag={team?.team_tag}
                team_1_icon_path={team?.team_icon_path}
              ></MatchTidbit>
            ) : (
              <></>
            )}
            <div className="my-5 grid w-full auto-cols-max grid-flow-col items-center justify-center gap-5 text-center">
              <div className="flex flex-col ">
                <Countdown className="font-mono text-4xl" value={countdown_d} />
                days
              </div>
              <div className="flex flex-col">
                <Countdown className="font-mono text-4xl" value={countdown_h} />
                hours
              </div>
              <div className="flex flex-col">
                <Countdown className="font-mono text-4xl" value={countdown_m} />
                min
              </div>
              <div className="flex flex-col">
                <Countdown className="font-mono text-4xl" value={countdown_s} />
                sec
              </div>
            </div>{' '}
            <h4 className="mt-2 flex flex-col">
              <span>{humanReadableDate.toDateString()}</span>
              <span>{humanReadableDate.toLocaleTimeString()}</span>
            </h4>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
