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
import moment from 'moment'
import { DD_PREFIX } from '../globals/riot_consts'
import TournamentFillingUp from '../components/common/TournamentDisplay/TournamentFillingUp'
import TournamentFull from '../components/common/TournamentDisplay/TournamentFull'
import TournamentSeeded from '../components/common/TournamentDisplay/TournamentSeeded'
import { IMatch, IRound, ITeam, ITournament } from '../globals/types'

let body: HTMLBodyElement | null = null
let localStorage: Storage
export interface Props {
  is_dark: boolean
  setDark: Function
}

// let carry_flag = {
//   minutes: true,
//   hours: true,
//   days: true,
// }
enum TOURNAMENT_STATE {
  BUFFERING,
  FILLING_UP,
  FULL,
  SEEDED,
  ONGOING,
  ENDED
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
    favouriteChampion,
    rankInfo,
    team,
    tournaments,
    tournamentsMade,
  } = useUser()
  const [countdown_s, setCountdown_s] = useState<number>(0)
  const [countdown_m, setCountdown_m] = useState<number>(0)
  const [countdown_h, setCountdown_h] = useState<number>(0)
  const [countdown_d, setCountdown_d] = useState<number>(0)

  // const [secondsToNextMatch, setSecondsToNextMatch] = useState(10)

  const [raw_tournament_data, setRaw_tournament_data] =
    useState<ITournamentDisplayData>()
  const [organizer_data, setOrganizer_data] = useState<any>()

  const [vs_showing, setVs_showing] = useState<boolean>(false)
  const [tournament_state, setTournament_state] = useState<TOURNAMENT_STATE>(TOURNAMENT_STATE.BUFFERING)
  const [fresh_tournament_data, setFresh_tournament_data] = useState<ITournament>()

  const [next_opponent, setNext_opponent] = useState<ITeam>()

  const getUserTournament = async (id: string) => {
    const url =
      '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    console.log('getTournament(): ', result)

    setRaw_tournament_data(result)
    getTournamentOrganizer()
    return result.response
  }

  const getTournamentOrganizer = async () => {
    axios
      .get('/api/userData', {
        params: { ign: tournaments?.organized_by_ign },
      })
      .then(function (response) {
        let userDataResponse = response.data
        setOrganizer_data(userDataResponse)
      })
  }

  useEffect(() => {
    console.log(raw_tournament_data)
  }, [raw_tournament_data])

  const refreshTournamentInfo = () => {
    var tempTeamMembersData: Array<ITournamentDisplayData> = [
      { ign: 'Default', icon_id: '505', level: '120' },
    ]
  }

  // Countdown functionality
  useEffect(() => {
    console.log('tournaments value has changed:', tournaments?.tournament_id);

    refreshTournamentInfo()
    refreshTournamentData()

    if (tournaments != null) {
      if (
        tournaments.tournament_id != undefined &&
        tournaments.tournament_id != 'ABC123'
      ) {
        console.log('TOURNAMENT ID::::::', tournaments)

        getUserTournament(tournaments.tournament_id)
      }

    }
    // *** COUNTDOWN LOGIC START ***
    const humanReadableDate = new Date(Date.UTC(2022, 8, 3, 34, 22))
    const countDownDate = humanReadableDate
    const countDownTime = countDownDate.getTime()


    const countdownInterval = setInterval(function () {
      var now = new Date().getTime()
      var left = countDownTime - now
      if (tournaments) {
        left = moment(tournaments.date_time_start).toDate().getTime() - now
      }

      setCountdown_d(Math.floor(left / (1000 * 60 * 60 * 24)))
      setCountdown_h(
        Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      )
      setCountdown_m(Math.floor((left % (1000 * 60 * 60)) / (1000 * 60)))
      setCountdown_s(Math.floor((left % (1000 * 60)) / 1000))

    }, 1000)
    if (moment() > moment(tournaments?.date_time_start)) {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
      return
    }
    // *** COUNTDOWN LOGIC END ***

    // *** CLEANUP ***
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }


  }, [tournaments])

  useEffect(() => {
    if (tournaments?.tournament_id != 'ABC123') {
      setTimeout(() => {
        refreshTournamentData()
      }, 1000);
    }
  }, [tournaments])



  const refreshTournamentData = async () => {

    if (tournaments != null) {
      let id = tournaments.tournament_id.toUpperCase()


      if (id != 'ABC123') {
        // Tournament Redis
        const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
        const result = await fetch(url)
          .then((res) => res.json())
          .catch((res) => console.log(res.error))

        setFresh_tournament_data(result)
        console.log('fresh:', fresh_tournament_data);
        console.log('stake:', tournaments);
      }
    }
  }

  useEffect(() => {
    evaluateTournamentState()
    getNextOpponent()
    // *** TOURNAMENT STATE LOGIC START ***
    const stateInterval = setInterval(function () {
      evaluateTournamentState()
    }, 1000)
    // *** TOURNAMENT STATE LOGIC END ***
    // *** CLEANUP ***
    return () => {
      if (stateInterval) {
        clearInterval(stateInterval)
      }
    }
  }, [fresh_tournament_data])

  const evaluateTournamentState = () => {

    if (fresh_tournament_data != undefined) {
      const tournaments = fresh_tournament_data

      if (tournaments && tournaments.tournament_id != 'ABC123') {


        // Filling Up
        if (tournaments.teams.length < tournaments.type) {
          if (tournament_state != TOURNAMENT_STATE.FILLING_UP) {
            setTournament_state(TOURNAMENT_STATE.FILLING_UP)
          }
        }
        // Full
        const seeding_date_time = moment(tournaments.date_time_start).subtract(1, 'hour');
        if (tournaments.teams.length == tournaments.type && moment(new Date()) < seeding_date_time) {
          if (tournament_state != TOURNAMENT_STATE.FULL) {
            setTournament_state(TOURNAMENT_STATE.FULL)
          }
        }
        // Seeding
        if (tournaments.teams.length == tournaments.type && moment(new Date()) >= seeding_date_time && !tournaments.rounds) {
          if (tournament_state != TOURNAMENT_STATE.SEEDED) {
            setTournament_state(TOURNAMENT_STATE.SEEDED)
          }
        }


        // In Progress
        if (tournaments.teams.length == tournaments.type && moment(new Date()) >= moment(tournaments.date_time_start) && tournaments.rounds) {
          if (tournament_state != TOURNAMENT_STATE.ONGOING) {
            setVs_showing(true)
            setTournament_state(TOURNAMENT_STATE.ONGOING)
          }
        }
        // console.log(tournament_state, tournaments.teams.length, tournaments.type);
        // console.log(moment(new Date()) >= moment(tournaments.date_time_start) && tournaments.rounds);
        // console.log(tournaments.rounds);

        // !Something is wrong with the moment calculations. When the countdown reaches about 3 minutes, the seeding state is no longer active
      }
    }
  }

  const getNextOpponent = () => {
    let currentRound: IRound = {
      round_id: 'ABC123',
      matches: [],
      date_time_start: '',
      date_time_end: '',
      round_winners: []
    }
    let nextOpponent: ITeam = {
      team_icon_path: 0,
      team_tag: 'ABC123',
      team_colour_hex: '',
      team_owner: '',
      team_members: [],
      team_name: '',
      team_statistics: { tournaments_played: 0, tournaments_won: 0, matches_won: 0, people_met: 0 },
      team_join_key: '',
      tournament_id: ''
    }

    if (tournaments) {
      tournaments.rounds?.forEach((round: IRound) => {
        currentRound = round
      })
      if (currentRound.round_id != 'ABC123') {
        currentRound.matches.forEach((match: IMatch) => {
          if (match != null) {
            if (match.teams[0].team_tag == team?.team_tag) {
              nextOpponent = match.teams[1]
            }
            if (match.teams[1].team_tag == team?.team_tag) {
              nextOpponent = match.teams[0]
            }
            setNext_opponent(nextOpponent)
          }
        })
      }
    }
  }

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
          className={`${(team != null && tournaments?.tournament_id != 'ABC123' ? ' col-start-1 col-end-4' : '')} ${(team == null && tournaments?.tournament_id == 'ABC123' ? ' col-start-1 col-end-4' : '')} relative row-start-1 row-end-2 ml-0 flex h-full flex-row justify-around rounded-md bg-green-100 text-center text-black-800 scrollbar-hide dark:bg-black-600`}
        >
          {/* Countdown Container */}
          {(team != null && tournaments?.tournament_id != 'ABC123') &&
            <>
              <div className="relative my-2 mx-2 flex w-72 flex-row justify-between rounded-md bg-green-200 p-2 dark:bg-black-500 dark:text-white-200">
                <div className="flex h-full w-4/5 flex-col justify-between">
                  <div className="flex flex-col items-center pb-2 ">
                    <Countdown
                      className=" font-mono text-6xl"
                      value={countdown_d}
                    />
                    days
                  </div>
                  <h4 className="text-md flex flex-col text-black-600 dark:text-white-600 ">
                    <span>{tournaments?.date_time_start}</span>
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
            </>
          }

          <div className="relative ml-auto flex h-full w-full justify-center p-2">
            {team && vs_showing ? (
              <div className="relative  flex h-full w-11/12 flex-row gap-4 self-center">
                {/* Skewed backgrounds */}
                <span className=" absolute right-0 top-1/2 h-16 w-1/2 -translate-y-1/2 -skew-x-[30deg] bg-gradient-to-l from-[#00FF88] to-[#00C288]"></span>
                <span className=" absolute left-0 top-1/2 h-16 w-1/2 -translate-y-1/2 -skew-x-[30deg] bg-gradient-to-r from-[#0284C7] to-[#02848C]"></span>
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

                  <span className="absolute bottom-3 left-0 font-extrabold text-[#0284C7] drop-shadow-lg">
                    S
                  </span>
                </span>
                {/* Right Team Container */}
                <div className="absolute right-0 top-1/2 flex h-16 w-1/2 -translate-y-1/2 items-center justify-end  text-5xl">
                  <span className="absolute right-2/3 z-50 translate-x-full font-semibold text-white-200 drop-shadow-lg">
                    {next_opponent?.team_tag}
                  </span>
                  <span className="absolute max-h-16 w-16 rounded-md drop-shadow-lg ">
                    <Image
                      src={logos[next_opponent?.team_icon_path || 0].src}
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
          className="border-secondary border-2 relative col-start-1 col-end-4 row-start-2 row-end-3 h-full flex-col justify-between rounded-md bg-green-100 dark:bg-black-600 md:flex md:h-full md:w-full"
        >
          {team == null || team.team_tag == 'ABC' ? (
            <div className="relative flex h-full w-full flex-col items-center justify-center text-5xl">
              <p className="mr-4 mt-auto mb-8 font-heading all-small-caps">
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
              <div
                id="footer"
                className="footer footer-center mt-auto p-4 text-base-content"
              >
                <span className="flex flex-row gap-1">
                  &copy; 2022
                  <a
                    target={'_blank'}
                    href="http://junefaleiro.com"
                    className="m-0 hover:text-base-300"
                  >
                    June Faleiro
                  </a>
                </span>
              </div>
            </div>
          ) : tournaments == null || tournaments?.tournament_id == 'ABC123' ? (
            <div className="relative flex h-full w-full items-center justify-center text-5xl ">
              <p className="mr-4 font-heading all-small-caps">
                <p className="align-middle ">
                  Please
                  <span className="align-top text-primary"> create</span>,
                  <span className="align-top text-secondary "> join</span> or
                  <span className="align-top text-secondary "> find</span> a
                  tournament
                </p>
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-row h-[94px] items-stretch justify-between border-b-2 border-gray-200 dark:border-gray-600 p-4 ">
                <div className="flex w-1/3 items-start text-2xl">
                  {organizer_data != undefined && organizer_data != null ? (
                    <div className="flex flex-row items-start gap-2 ">
                      <div className=" group relative inline-flex h-[68px] w-[68px] flex-row gap-4 border-2 border-green-500 transition-[border] md:h-[60px] md:w-[60px] ">
                        <Image
                          src={
                            organizer_data.profileIconId === undefined
                              ? '/images/spinner.svg'
                              : DD_PREFIX +
                              'img/profileicon/' +
                              organizer_data.profileIconId +
                              '.png'
                          }
                          alt="Profile picture"
                          layout="fill"
                          objectFit="cover"
                          className=""
                        ></Image>
                        <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] ">
                          {organizer_data.summonerLevel === undefined
                            ? '666'
                            : organizer_data.summonerLevel}
                        </span>
                      </div>
                      <div className="flex flex-col text-sm">
                        Organized by
                        <span className="flex-start flex text-3xl all-small-caps">
                          {tournaments.organized_by_ign}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>loading...</div>
                  )}
                </div>
                <div className="flex w-1/3 justify-center items-center text-3xl drop-shadow-lg ">
                  {tournaments?.tournament_name ||
                    <span className='text-red-600'>Unable to load tournament correctly, please log out and in.</span>}
                </div>
                <div className=" flex w-1/3 flex-col items-end justify-start gap-2 text-sm ">
                  {tournaments.lobby_code == '' ? (
                    <p className=""> Public Tournament</p>
                  ) : (
                    <>
                      <span>Reveal Tournament ID:</span>
                      <div className=" group relative h-min rounded-sm bg-black-700 px-1 py-0.5 shadow-md transition-all duration-75 hover:cursor-pointer active:bg-gray-600 active:duration-[0]">
                        <span
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() =>
                            navigator.clipboard.writeText(tournaments.tournament_id)
                          }
                          title="Click to copy"
                        >
                          {tournaments.tournament_id}
                        </span>
                      </div>
                      <span>Reveal Join Code:</span>
                      <div className=" group relative h-min rounded-sm bg-black-700 px-1 py-0.5 shadow-md transition-all duration-75 hover:cursor-pointer active:bg-gray-600 active:duration-[0]">
                        <span
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() =>
                            navigator.clipboard.writeText(tournaments.lobby_code)
                          }
                          title="Click to copy"
                        >
                          {tournaments.lobby_code}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {tournament_state == TOURNAMENT_STATE.BUFFERING && (<img className='w-48 h-48 mx-auto' src='/images/spinner.svg'></img>)}
              {tournament_state == TOURNAMENT_STATE.FILLING_UP && (<TournamentFillingUp team={team} tournament={tournaments}></TournamentFillingUp>)}
              {tournament_state == TOURNAMENT_STATE.FULL && (<TournamentFull team={team} tournament={tournaments}></TournamentFull>)}
              {tournament_state == TOURNAMENT_STATE.SEEDED && (<TournamentSeeded team={team} tournament={tournaments}></TournamentSeeded>)}
              {tournament_state == TOURNAMENT_STATE.ONGOING &&
                (<TournamentDisplay
                  team={team}
                  tournament={tournaments}
                ></TournamentDisplay>)
              }

              <div
                id="footer"
                className="footer footer-center p-4 text-gray-400 dark:text-gray-600"
              >
                <span className="flex flex-row gap-1">
                  &copy; 2022
                  <a
                    target={'_blank'}
                    href="http://junefaleiro.com"
                    className="m-0 hover:text-base-300"
                  >
                    June Faleiro
                  </a>
                </span>
              </div>
            </>
          )}

          {/* {displayName} {biography} {ign} */}
        </div>
        {/* Right Half */}
        {
          team != null && (
            tournaments?.tournament_id == 'ABC123' &&
            <div
              id="top_right"
              className={`${tournaments?.tournament_id == 'ABC123' ? 'md:cols-end-2 row-start-1 row-end-1 md:col-start-2' : ''} flex h-full flex-col gap-3 self-start rounded-md bg-green-100 dark:bg-black-600`}
            >
              <div
                className={`${tournaments == null || tournaments?.tournament_id == 'ABC123'
                  ? 'animate-pulse'
                  : 'animate-none'
                  }  flex h-full flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 hover:animate-none dark:bg-emerald-900 md:flex-col`}
              >
                <Link href="tournaments/create_tournament">
                  <Button
                    text="Create Tournament"
                    noMargin
                    type="positive"
                    className=" text-white-500 drop-shadow-sm"
                  ></Button>
                </Link>
                <div className="mt-auto flex w-[150%] flex-col gap-2 rounded-md bg-emerald-400 p-2 drop-shadow-sm dark:bg-emerald-800 md:w-auto">
                  <Link href="tournaments/join_tournament">
                    <Button
                      text="Join Tournament"
                      noMargin
                      type="neutral"
                      className="text-white-500"
                    ></Button>
                  </Link>
                  <Link href="tournaments/join_public_tournament">
                    <Button
                      text="Find Tournament"
                      noMargin
                      type="neutral"
                      className="text-white-500"
                    ></Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        }
      </main >
    </div >
  )
}

export default Home
