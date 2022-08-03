import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment, { Moment } from 'moment'
import { Toggle } from 'react-daisyui'
import { Capitalize } from '../../globals/global_functions'
import { useUser } from '../../context/UserContext'
import { IAccountData, ITournament } from '../../globals/types'
import Router from 'next/router'

type Props = {}

export default function create_tournament({ }: Props) {
  const {
    displayName,
    biography,
    ign,
    setUserDetails,
    rankInfo,
    statistics,
    team,
    tournaments,
    tournamentsMade,
    favouriteChampion,
  } = useUser()
  const [name, setName] = useState('')
  const [number_of_teams, setNumber_of_teams] = useState<4 | 8 | 16>(8)
  const [startDateTime, setStartDateTime] = useState<string | Moment>()
  const [startDateTimeString, setStartDateTimeString] = useState<string>()

  const [is_private, setPrivate] = useState<boolean>(true)
  const [lobby_code, setLobby_code] = useState('')
  const [tournament_id, setTournamentID] = useState('')

  const [dataOut, setDataOut] = useState<ITournament>()

  useEffect(() => {
    setStartDateTimeString(startDateTime?.toString())

    // console.log(startDateTime?.toString())
    // console.log(moment(startDateTime?.toString()))
  }, [startDateTime])

  const handleTournamentCreateFormSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      createTournament()
    }
  }

  const createTournament = () => {
    const dataOut: ITournament = {
      // Initial Tournament Data
      tournament_name: name,
      type: number_of_teams,
      date_time_start: startDateTimeString || moment().toString(),
      is_private,
      lobby_code: is_private ? lobby_code.toUpperCase() : '',
      tournament_id: tournament_id.toUpperCase(),
      // Generative Tournament Data
      rounds: null,
      date_time_end: null,
      winning_team: null,
      // Tournament metadata
      organized_by_ign: ign,
    }
    setDataOut(dataOut)

    // *Debug*
    console.log(
      'Creating Tournament with values:',
      name,
      number_of_teams,
      startDateTimeString,
      is_private,
      tournament_id,
      lobby_code
    )
  }

  useEffect(() => {
    console.log('dataOut', dataOut)

    saveTournamentDetailsToCloud()
  }, [dataOut])

  const saveTournamentDetailsToCloud = async () => {
    if (tournament_id != '') {
      // Check tournament ID isn't taken
      const url = '/api/tournament/tournamentExists?' + new URLSearchParams({ tournament_id: tournament_id.toUpperCase() })
      const result = await fetch(url)
        .then((res) => res.json())
        .catch((res) => console.log(res.error))

      console.log('TournamentExists Result: ', result)

      if (result != undefined) {
        if (result.response == 'EXISTS') {
          alert('Tournament ID in use. Please try another')
        } else {
          // Save tournament details
          const response = await fetch('/api/tournament/tournament', {
            body: JSON.stringify({ data: dataOut }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })

          const { error } = await response.json()
          console.log('error:', error)

          if (error) {
            console.log('error:', error)
          } else if (response.status == 200 && dataOut != undefined) {
            if (setUserDetails != undefined) {
              setUserDetails(
                displayName,
                biography,
                ign,
                favouriteChampion,
                rankInfo,
                statistics,
                tournamentsMade + 1,
                dataOut,
                team
              )
              localStorage.setItem(
                'userDetails',
                JSON.stringify({
                  displayName: displayName,
                  biography: biography,
                  ign: ign,
                  favouriteChampion: favouriteChampion,
                  rankInfo: {
                    tier: rankInfo.tier,
                    rank: rankInfo.rank,
                    wins: rankInfo.wins,
                    losses: rankInfo.losses,
                  },
                  statistics: {
                    tournaments_played: statistics.tournaments_played,
                    tournaments_won: statistics.tournaments_won,
                    matches_won: statistics.matches_won,
                    people_met: statistics.people_met,
                  },
                  tournamentsMade: tournamentsMade + 1,
                  tournaments: dataOut,
                  team: team,
                })
              )
              // Redis account team set
              let get_data: any = null
              const account_api_url =
                '/api/account?' + new URLSearchParams({ ign: ign })
              const account_get_response = await fetch(account_api_url)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error('HTTP status ' + res.status)
                  }
                  return res.json()
                })
                .then(async (res) => {
                  if (res.status != 'Account does not yet exist') {
                    get_data = res
                  }
                })
                .catch((res) => console.log(res.error))
              if (get_data != undefined) {
                const accountDataOut: IAccountData = {
                  ign: get_data.ign,
                  username: get_data.username,
                  bio: get_data.bio,
                  favourite_champion: get_data.favourite_champion,
                  passcode: get_data.passcode,
                  team_tag: get_data.team_tag,
                  tournament_id: dataOut.tournament_id,
                }
                const account_post_response = await fetch('/api/account', {
                  body: JSON.stringify({ data: accountDataOut }),
                  headers: { 'Content-Type': 'application/json' },
                  method: 'PATCH',
                })
              }
            }
          }
          Router.push('/main')
        }
      }
    }
  }
  return (
    <div
      id="wrapper"
      className=" grid h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <Head>
        <title>Create Tournament</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto w-full sm:w-[300px]">
        <div className="flex flex-col rounded-md bg-gray-300 p-4 text-lg transition-all dark:bg-black-600">
          <div className="mb-2 flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label tabIndex={0} className="mb-2">
              Tournament Name
            </label>
            <input
              type="text"
              placeholder="Worlds Group Cup 2022"
              className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1  text-black-900 first-letter:capitalize dark:text-white-100"
              onChange={(e) => setName(e.target.value)}
              onKeyUp={(e) => handleTournamentCreateFormSubmit(e)}
            />
          </div>
          <div className="my-2 flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label tabIndex={0} className="mb-2">
              Number of Teams
            </label>
            <input
              type="range"
              min="1"
              max="3"
              defaultValue={2}
              className="range range-secondary range-xs"
              step={1}
              onChange={(e) => {
                switch (e.target.value) {
                  case '1':
                    setNumber_of_teams(4)
                    break
                  case '2':
                    setNumber_of_teams(8)
                    break
                  case '3':
                    setNumber_of_teams(16)
                    break
                  default:
                    break
                }
              }}
              onKeyUp={(e) => handleTournamentCreateFormSubmit(e)}
            />
            <div className="flex w-full justify-between px-2 text-sm">
              <div className="flex flex-col items-start">
                <span>▢</span> <span> 4</span>
              </div>
              <div className="flex flex-col items-center">
                <span>▢</span> <span> 8</span>
              </div>
              <div className="flex flex-col items-end">
                <span>▢</span> <span> 16</span>
              </div>
            </div>
          </div>
          <div className="my-2 flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label>Start Date & Time</label>
            <div className=" w-min rounded-md border-2 border-black-400 bg-white-100 p-2 dark:bg-black-900">
              <Datetime
                onChange={(e) => setStartDateTime(e)}
                initialValue={new Date()}
                className=" dark:text-black-500 dark:invert "
              />
            </div>
          </div>
          <div
            className={`${is_private ? 'mb-2 ' : 'mb-0 '
              } mt-2 flex flex-col rounded-md bg-gray-200 p-2  dark:bg-black-500`}
          >
            <div className="flex w-full flex-row items-center justify-between ">
              <span>Private</span>
              <Toggle
                color="secondary"
                size="md"
                onChange={(e) => setPrivate(!e.target.checked)}
              ></Toggle>
              <span>Public</span>
            </div>
          </div>
          <div
            className={`
               pointer-events-auto my-2 max-h-full opacity-100 h-full rounded-md bg-gray-200 p-2 dark:bg-black-500`}
          >
            <div className="flex w-full flex-col justify-between ">
              <label tabIndex={0} className="mb-2">
                Tournament ID Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="ABC123"
                className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1 uppercase  text-black-900 first-letter:capitalize dark:text-white-100"
                onChange={(e) => setTournamentID(e.target.value)}
                onKeyUp={(e) => handleTournamentCreateFormSubmit(e)}
              />
            </div>
          </div>
          <div
            className={`${is_private
              ? 'pointer-events-auto my-2 max-h-full opacity-100'
              : 'pointer-events-none my-0 max-h-0 opacity-0'
              } h-full rounded-md bg-gray-200 p-2 dark:bg-black-500`}
          >
            <div className="flex w-full flex-col justify-between ">
              <label tabIndex={0} className="mb-2">
                Lobby Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="ABC123"
                className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1 uppercase  text-black-900 first-letter:capitalize dark:text-white-100"
                onChange={(e) => setLobby_code(e.target.value)}
                onKeyUp={(e) => handleTournamentCreateFormSubmit(e)}
              />
            </div>
          </div>
          <div
            className={`${is_private ? 'mt-2 ' : 'mt-0 '
              } flex flex-col rounded-md bg-gray-200 p-2 pr-4 transition-all dark:bg-black-500`}
          >
            <Button
              text="Create"
              type="positive"
              className=""
              onClick={() => createTournament()}
            ></Button>
          </div>
        </div>
      </main>
    </div>
  )
}
