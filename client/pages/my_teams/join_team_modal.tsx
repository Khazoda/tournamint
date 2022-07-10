import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Button from '../../components/common/Button'
import { useUser } from '../../context/UserContext'
import { Capitalize } from '../../globals/global_functions'
import { IAccountData } from '../../globals/types'

interface Props {
  onClick: any
}

const JoinTeamModal = (props: Props) => {
  const { onClick = null, ...restProps } = props
  const [tag_out, setTag_out] = useState<string>('')
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

  const handleUserDetailsFormSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      joinTeam(tag_out)
    }
  }

  // ?DEBUG?
  // const TEST = async (tag: string) => {
  //   tag = tag.toUpperCase()
  //   const url = '/api/teamData?' + new URLSearchParams({ team_tag: tag })
  //   const result = await fetch(url)
  //     .then((res) => res.json())
  //     .catch((res) => console.log(res.error))

  //   console.log('getUserTeam(): ', result)
  // }

  const joinTeam = async (tag: string) => {
    tag = tag.toUpperCase()
    console.log('TAG:', tag)

    const url = '/api/teamData?' + new URLSearchParams({ team_tag: tag })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    let team_temp = result.response
    if (team_temp.team_join_key == code_out) {
      if (team != null) {
        alert('You are already in a team.')
      } else {
        if (result.response == null) {
          alert('Invalid Team Tag.')
        } else {
          if (team_temp.team_owner == ign) {
            alert(
              'you are the team owner, how did you even access this page? 🤔'
            )
          } else {
            if (!team_temp.team_members.includes(ign)) {
              team_temp.team_members.push(ign)
              const response = await fetch('/api/teamData', {
                body: JSON.stringify({ data: team_temp }),
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
              })
              if (setUserDetails != undefined) {
                setUserDetails(
                  displayName,
                  biography,
                  ign,
                  favouriteChampion,
                  rankInfo,
                  statistics,
                  tournamentsMade,
                  tournaments,
                  team_temp
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
                  tournaments: tournaments,
                  team: team_temp,
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
                const dataOut: IAccountData = {
                  ign: get_data.username,
                  username: get_data.username,
                  bio: get_data.bio,
                  favourite_champion: get_data.favourite_champion,
                  passcode: get_data.passcode,
                  team_tag: tag,
                }
                const account_post_response = await fetch('/api/account', {
                  body: JSON.stringify({ data: dataOut }),
                  headers: { 'Content-Type': 'application/json' },
                  method: 'PATCH',
                }).then(() => onClick())
              }
              console.log('Team Join Status:', response.status)
            }
          }
        }
      }
    } else {
      alert(
        'TODO: popup tell user there is a tag/code mismatch | ALSO: autocapitalize team tag input on backend xx'
      )
    }
  }

  return (
    <div className="absolute top-0 left-0  z-50 h-screen w-screen bg-transparent backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 flex h-[500px] w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-md border-2 border-green-400 bg-green-400 drop-shadow-lg dark:border-black-800 dark:bg-black-600 md:w-[350px]">
        <button
          className="ml-auto mt-2 mr-2 hover:cursor-pointer"
          onClick={onClick}
        >
          <FiX size={24}></FiX>
        </button>
        <h1 className="mt-5 text-2xl">Join Team</h1>
        <div className="mt-12 flex flex-col text-lg">
          <form
            className="flex flex-col items-start "
            onSubmit={(e) => {
              e.preventDefault()
              return false
            }}
          >
            <span className="mt-2 mb-1">Team Tag:</span>
            <input
              id="tag_input"
              type="text"
              maxLength={3}
              className="rounded-md border-2 border-green-500 bg-green-600 px-1 dark:border-black-400 dark:bg-black-400"
              onChange={(e) => setTag_out(e.target.value)}
              onKeyUp={(e) => handleUserDetailsFormSubmit(e)}
            />
            <span className="mt-2 mb-1">Team Join Code:</span>
            <input
              id="code_input"
              type="text"
              className=" rounded-md border-2 border-green-500 bg-green-600 px-1 dark:border-black-400 dark:bg-black-400"
              onChange={(e) => setCode_out(e.target.value)}
              onKeyUp={(e) => handleUserDetailsFormSubmit(e)}
            />

            <Button
              text="Join"
              type="positive"
              className="mt-4"
              fixedWidth
              onClick={() => joinTeam(tag_out)}
            ></Button>
          </form>
        </div>
        {/* ?DEBUG? */}
        {/* <Button
          text="TEST Get Team Data"
          noMargin
          type="neutral"
          
          onClick={() => TEST(tag_out)}
          className="text-white-500"
        ></Button> */}
      </div>
    </div>
  )
}

export default JoinTeamModal
