import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'
import { Button as DaisyButton } from 'react-daisyui'

import { useUser } from '../context/UserContext'
import TeamTidbit from '../components/common/TeamTidbit'
import logos from '../globals/team_logos'

import { default_card_statistics } from '../globals/seed_data'
import MatchTidbit from '../components/common/MatchTidbit'
import TournamentDisplay from '../components/common/TournamentDisplay'
import Link from 'next/link'
import { Countdown, Stats } from 'react-daisyui'
import { Capitalize } from '../globals/global_functions'
import { FiUsers } from 'react-icons/fi'

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
interface ITournamentDisplayData {
  ign: string
  icon_id: string
  level: string
}
const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props
  const {
    displayName,
    biography,
    ign,
    statistics,
    team,
    tournaments,
    tournamentsMade,
  } = useUser()
  const [countdown_s, setCountdown_s] = useState<number>(0)
  const [countdown_m, setCountdown_m] = useState<number>(0)
  const [countdown_h, setCountdown_h] = useState<number>(0)
  const [countdown_d, setCountdown_d] = useState<number>(0)

  const [secondsToNextMatch, setSecondsToNextMatch] = useState(10)

  const [raw_team_data, setRaw_team_data] = useState<ITournamentDisplayData>()

  useEffect(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }

    console.log(team)
  }, [])

  useEffect(() => {
    refreshTournamentInfo()
    if (tournaments != null) {
      if (
        tournaments.tournament_id != undefined &&
        tournaments.tournament_id != 'ABC123'
      ) {
        getUserTournament(tournaments.tournament_id)
      }
    }
  }, [tournaments])

  const getUserTournament = async (id: string) => {
    const url =
      '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    console.log('getTournament(): ', result)

    setRaw_team_data(result.response)
    console.log(raw_team_data)

    return result.response
  }

  const refreshTournamentInfo = () => {
    var tempTeamMembersData: Array<ITournamentDisplayData> = [
      { ign: 'Default', icon_id: '505', level: '120' },
    ]
  }

  // Countdown function
  var countdownInterval = setInterval(function () {
    var now = new Date().getTime()
    var left = countDownTime - now

    setCountdown_d(Math.floor(left / (1000 * 60 * 60 * 24)))
    setCountdown_h(
      Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    )
    setCountdown_m(Math.floor((left % (1000 * 60 * 60)) / (1000 * 60)))
    setCountdown_s(Math.floor((left % (1000 * 60)) / 1000))
  }, 1000)

  // Countdown logic
  const humanReadableDate = new Date(Date.UTC(2022, 8, 3, 34, 22))
  const countDownDate = humanReadableDate
  const countDownTime = countDownDate.getTime()

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

      <main className="mx-auto grid h-full w-full max-w-[1920px] items-center gap-4 text-center md:grid-cols-[_minmax(100px,1fr),300px] md:grid-rows-[180px,_minmax(100px,1fr)] md:gap-2 ">
        {/* Left Half */}
        <div
          id="top_left"
          className="relative col-start-1 col-end-2 row-start-1 row-end-2 ml-0 flex h-full flex-row justify-around rounded-md bg-green-100 text-center text-black-800 scrollbar-hide dark:bg-black-600"
        >
          <div className="relative my-2 mx-2 flex w-48 flex-row justify-between rounded-md bg-green-200 p-2 dark:bg-black-500 dark:text-white-200">
            <div className="flex h-full w-1/2 flex-col justify-between">
              <div className="flex flex-col items-center pb-2 ">
                <Countdown
                  className=" font-mono text-6xl"
                  value={countdown_d}
                />
                days
              </div>
              <h4 className="text-md flex flex-col text-black-600 dark:text-white-600 ">
                <span>{humanReadableDate.toLocaleString()}</span>
              </h4>
            </div>
            <div className="grid w-auto grid-flow-row auto-rows-max items-center justify-center gap-1 ">
              <div className="flex flex-col items-center">
                <Countdown className="font-mono text-2xl" value={countdown_h} />
                hours
              </div>
              <div className="flex flex-col items-center">
                <Countdown className="font-mono text-2xl" value={countdown_m} />
                min
              </div>
              <div className="flex flex-col items-center">
                <Countdown className="font-mono text-2xl" value={countdown_s} />
                secs
              </div>
            </div>
          </div>
          <span className="relative top-1/4 my-2 h-3/4 w-1 -translate-y-1/4 bg-black-500"></span>
          <div className="relative ml-auto flex h-full w-full justify-center p-2">
            {team ? (
              <div className="relative  flex h-full w-11/12 flex-row gap-4 self-center">
                {/* Skewed backgrounds */}
                <span className=" absolute right-0 top-1/2 h-16 w-1/2 -translate-y-1/2 -skew-x-[30deg] bg-gradient-to-l from-[#00FF88] to-[#00552d]"></span>
                <span className=" absolute left-0 top-1/2 h-16 w-1/2 -translate-y-1/2 -skew-x-[30deg] bg-gradient-to-r from-[#00A2FF] to-[#003a5c]"></span>
                {/* Left Team Container */}
                <div className="absolute left-0 top-1/2 flex h-16 w-1/2 -translate-y-1/2 items-center text-5xl">
                  <span className="absolute max-h-16 w-16 rounded-md drop-shadow-lg ">
                    <img
                      className="h-full w-16"
                      src={logos[team.team_icon_path].src}
                      alt=""
                    />
                  </span>
                  <span className="absolute left-2/3 z-50 -translate-x-full font-semibold text-white-200 drop-shadow-lg">
                    {team.team_tag}
                  </span>
                </div>
                {/* VS */}
                <span className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2 text-8xl">
                  <span className=" absolute top-3 -left-14 z-50 font-extrabold  text-primary drop-shadow-lg">
                    V
                  </span>
                  <div>
                    <span className="absolute bottom-6 left-3 h-32 w-1 rotate-[30deg]  bg-[#00552d] drop-shadow-md"></span>
                    <span className="absolute bottom-3 right-0 h-32 w-1 rotate-[30deg]  bg-white-800 drop-shadow-md"></span>
                    <span className="absolute bottom-0 right-4 h-32 w-1 rotate-[30deg]  bg-[#003a5c] drop-shadow-md"></span>
                  </div>

                  <span className="absolute bottom-3 left-0 font-extrabold text-secondary drop-shadow-lg">
                    S
                  </span>
                </span>
                {/* Right Team Container */}
                <div className="absolute right-0 top-1/2 flex h-16 w-1/2 -translate-y-1/2 items-center justify-end  text-5xl">
                  <span className="absolute right-2/3 z-50 translate-x-full font-semibold text-white-200 drop-shadow-lg">
                    {team.team_tag}
                  </span>
                  <span className="absolute max-h-16 w-16 rounded-md drop-shadow-lg ">
                    <Image
                      src={logos[team.team_icon_path].src}
                      width={100}
                      height={100}
                    ></Image>
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div
          id="bottom_left"
          className="relative col-start-1 col-end-3 row-start-2 row-end-3 flex-col justify-center rounded-md bg-green-100 dark:bg-black-600 md:flex md:h-full md:w-full"
        >
          {team == null || team.team_tag == 'ABC' ? (
            <div className="relative flex h-full w-full items-center justify-center text-5xl ">
              <p className="mr-4 font-heading all-small-caps">
                <p className="align-middle ">
                  Please
                  <span className="align-top text-primary"> create</span> or
                  <span className="align-top text-secondary "> join</span> a
                  team
                </p>
              </p>
              <Link href="/my_teams">
                <a href="">
                  <DaisyButton
                    variant="outline"
                    startIcon={<FiUsers />}
                    color="success"
                    className="animate-bounce transition-all hover:animate-none"
                  >
                    My Team
                  </DaisyButton>
                </a>
              </Link>
            </div>
          ) : (
            <>
              <div className="absolute left-1/2 top-4  -translate-x-1/2 pt-2 text-2xl">
                ( Tournament Bracket Name)
              </div>
              <TournamentDisplay team={team}></TournamentDisplay>
            </>
          )}

          {/* {displayName} {biography} {ign} */}
        </div>
        {/* Right Half */}
        <div
          id="top_right"
          className=" md:cols-end-2 row-start-1 row-end-1 flex  h-full flex-col gap-3 self-start rounded-md bg-green-100 dark:bg-black-600 md:col-start-2"
        >
          <div className=" flex h-full flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 md:flex-col">
            <Link href="tournaments/create_tournament">
              <Button
                text="Create Tournament"
                noMargin
                type="positive"
                className=" text-white-500 drop-shadow-sm"
              ></Button>
            </Link>
            <div className="mt-auto flex w-[150%] flex-col gap-2 rounded-md bg-emerald-400 p-2 drop-shadow-sm dark:bg-emerald-800 md:w-auto">
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
      </main>
    </div>
  )
}

export default Home
