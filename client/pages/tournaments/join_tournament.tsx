import Head from 'next/head'
import Router from 'next/router'
import React from 'react'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Button from '../../components/common/Button'
import { useUser } from '../../context/UserContext'
import { Capitalize } from '../../globals/global_functions'
import { IAccountData, ITeam } from '../../globals/types'

interface Props {
  onClick: any
}
export default function join_tournament(props: Props) {

  const { onClick = null, ...restProps } = props

  const [tournament_id, setTournament_id] = useState<string>('')
  const [lobby_code, setLobby_code] = useState<string>('')

  const [code_out, setCode_out] = useState<string>('')

  const {
    displayName,
    biography,
    ign,
    statistics,
    team,
    favouriteChampion,
    rankInfo,
    tournaments,
    tournamentsMade,
    setUserDetails,
  } = useUser()

  const handleTournamentJoinFormSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      joinTournament()
    }
  }

  const joinTournament = async () => {

    // Account Redis
    let account_data: any = null
    const account_api_url =
      '/api/account?' + new URLSearchParams({ ign: ign })
    const account_get_response = await fetch(account_api_url)
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status != 'Account does not yet exist') {
          account_data = res
        }
      })
      .catch((res) => console.log(res.error))


    // Tournament Redis
    var id = null
    id = tournament_id.toUpperCase()
    console.log('tournament_id:', id)

    const url = '/api/tournament/tournament?' + new URLSearchParams({ tournament_id: id })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    let tournament_temp = result
    console.log('TUTEMP', id, tournament_temp);

    if (tournament_temp.lobby_code.toUpperCase() == lobby_code.toUpperCase()) {
      if (tournaments?.tournament_id == id) {
        alert('Your team is already part of a tournament.')
      } else {
        if (tournament_temp == null) {
          alert('Invalid Tournament Tag.')
        } else {
          if (tournament_temp.organized_by_ign == ign) {
            alert(
              'you are the Tournament owner, how did you even access this page? 🤔'
            )
          } else {
            // TODO if(user is not team owner){} else {
            if (false) {
            } else {
              //! tournament_temp.teams.push(team)

              try {
                const dataOut: IAccountData = {
                  ign: ign,
                  username: account_data.username,
                  bio: account_data.bio,
                  favourite_champion: account_data.favourite_champion,
                  passcode: account_data.passcode,
                  team_tag: account_data.team_tag,
                  tournament_id: id,
                }
                // console.log('data_out', dataOut)

                const account_post_response = await fetch('/api/account', {
                  body: JSON.stringify({ data: dataOut }),
                  headers: { 'Content-Type': 'application/json' },
                  method: 'PATCH',
                })
              } catch (error) {
                console.log(error)
              }
              if (setUserDetails != undefined) {
                setUserDetails(
                  displayName,
                  biography,
                  ign,
                  favouriteChampion,
                  rankInfo,
                  statistics,
                  tournamentsMade,
                  tournament_temp,
                  team
                )
              }
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
                  tournamentsMade: tournamentsMade,
                  tournaments: tournament_temp,
                  team: team,
                })
              )
              // Redis team tournament set
              let get_team_data: any = null
              if (team != null) {
                const team_api_url =
                  '/api/teamData?' + new URLSearchParams({ team_tag: team.team_tag })
                const team_get_response = await fetch(team_api_url)
                  .then((res) => {
                    if (!res.ok) {
                      throw new Error('HTTP status ' + res.status)
                    }
                    return res.json()
                  })
                  .then(async (res) => {
                    if (res.status != 'Team does not exist') {
                      get_team_data = res.response
                    }
                  })
                  .catch((res) => console.log(res.error))

                if (get_team_data != undefined) {
                  console.log(get_team_data);

                  const teamDataOut: ITeam = {
                    team_icon_path: get_team_data.team_icon_path,
                    team_tag: get_team_data.team_tag,
                    team_colour_hex: get_team_data.team_colour_hex,
                    team_owner: get_team_data.team_owner,
                    team_members: get_team_data.team_members,
                    team_name: get_team_data.team_name,
                    team_statistics: get_team_data.team_statistics,
                    team_join_key: get_team_data.team_join_key,
                    tournament_id: tournament_id
                  }
                  const team_post_response = await fetch('/api/teamData', {
                    body: JSON.stringify({ data: teamDataOut }),
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
    } else {
      alert(
        'TODO: popup tell user there is a lobby code mismatch | ALSO: autocapitalize tournament tag input on backend xx'
      )
    }
  }


  return (
    <div
      id="wrapper"
      className=" grid h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <Head>
        <title>Join Tournament</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto w-full sm:w-[300px]">
        <div className="flex flex-col rounded-md bg-gray-300 p-4 text-lg transition-all dark:bg-black-600">

          <div
            className={` h-full rounded-md bg-gray-200 p-2 dark:bg-black-500 mb-2`}
          > <div className="flex w-full flex-col justify-between ">
              <label tabIndex={0} className="mb-2">
                Tournament ID
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="ABC123"
                className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1 uppercase  text-black-900 first-letter:capitalize dark:text-white-100"
                onChange={(e) => setTournament_id(e.target.value)}
                onKeyUp={(e) => handleTournamentJoinFormSubmit(e)}
              />
            </div>
          </div>

          <div
            className={` h-full rounded-md bg-gray-200 p-2 dark:bg-black-500`}
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
                onKeyUp={(e) => handleTournamentJoinFormSubmit(e)}
              />
            </div>
          </div>
          <div
            className={`flex flex-col rounded-md bg-gray-200 p-2 pr-4 transition-all dark:bg-black-500`}
          >
            <Button
              text="Join Tournament"
              type="positive"
              className=""
              onClick={() => joinTournament()}
            ></Button>
          </div>
        </div>
      </main>
    </div>
  )
}
