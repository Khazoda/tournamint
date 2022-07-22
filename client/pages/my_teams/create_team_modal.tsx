import { MouseEventHandler, useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import Image from 'next/image'
import Button from '../../components/common/Button'
import logos from '../../globals/team_logos'
import {
  IAccountData,
  ITeam,
  ITeamColour,
  TEAM_COLOURS,
} from '../../globals/types'
import { createID } from '../../globals/global_functions'
import { useUser } from '../../context/UserContext'
interface Props {
  onClick: any
}

const colours: Array<string> = [
  TEAM_COLOURS.BLUE,
  TEAM_COLOURS.GREEN,
  TEAM_COLOURS.LIME,
  TEAM_COLOURS.YELLOW,
  TEAM_COLOURS.ORANGE,
  TEAM_COLOURS.RED,
]

const CreateTeamModal = (props: Props) => {
  const { onClick = null, ...restProps } = props
  const {
    displayName,
    biography,
    ign,
    favouriteChampion,
    rankInfo,
    setUserDetails,
    statistics,
    tournamentsMade,
    tournaments,
    team,
  } = useUser()

  const TEAM = team
  const [selectedColour, setSelectedColour] = useState('')

  const [tag_out, setTag_out] = useState<string>('')
  const [name_out, setName_out] = useState<string>('')
  const [icon_out, setIcon_out] = useState<number>(0)
  const [colour_out, setColour_out] = useState<string>('')

  const [dataOut, setDataOut] = useState<any>()

  const icon_focused_default = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]
  const [is_icon_focused, setIconFocused] =
    useState<Array<boolean>>(icon_focused_default)

  const toggleIconFocus = (index: number) => {
    let newState = icon_focused_default
    newState[index] = true

    setIconFocused(newState)
  }

  const createTeam = () => {
    setDataOut({
      team_icon_path: icon_out,
      team_tag: tag_out.toUpperCase(),
      team_colour_hex: colour_out,
      team_owner: ign,
      team_members: [ign],
      team_name: name_out,
      team_statistics: statistics,
      team_join_key: createID(6),
      //
    })
  }

  useEffect(() => {
    saveTeamDetailsToCloud()
  }, [dataOut])

  const saveTeamDetailsToCloud = async () => {
    const response = await fetch('/api/teamData', {
      body: JSON.stringify({ data: dataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const { error } = await response.json()
    console.log('error:', error)

    if (error) {
      // console.log(error)
    } else if (response.status == 200) {
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
          dataOut
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
            tournamentsMade: tournamentsMade,
            tournaments: tournaments,
            team: dataOut,
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
            ign: get_data.ign,
            username: get_data.username,
            bio: get_data.bio,
            favourite_champion: get_data.favourite_champion,
            passcode: get_data.passcode,
            team_tag: tag_out.toUpperCase(),
            tournament_id: get_data.tournament_id,
          }
          const account_post_response = await fetch('/api/account', {
            body: JSON.stringify({ data: dataOut }),
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
          })
        }
      }
      onClick()
    }
  }
  useEffect(() => {
    // Redis Connection
    // const saveTeamDetailsToCloud = async () => {
    //   const response = await fetch('/api/teamData', { method: 'POST' })
    //   const data = await response.json()
    //   console.log(data)
    // }
  }, [dataOut])

  return (
    <div className="absolute top-0 left-0  z-50 h-screen w-screen bg-transparent backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 flex h-[625px] w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-md border-2 border-green-400 bg-green-400 drop-shadow-lg dark:border-black-800 dark:bg-black-600 sm:w-[350px]">
        <button
          className="ml-auto mt-2 mr-2 hover:cursor-pointer"
          onClick={onClick}
        >
          <FiX size={24}></FiX>
        </button>
        <h1 className=" text-2xl">Create Team</h1>
        <div className="mt-2 flex w-full flex-col gap-2 px-4 text-lg">
          <div className="flex flex-row gap-2 sm:justify-between">
            <input
              id="tag_input"
              type="text"
              placeholder="TAG"
              maxLength={3}
              onChange={(e) => setTag_out(e.target.value)}
              className="w-20 rounded-md border-2 border-green-500 bg-green-600 px-1 text-center uppercase placeholder:text-black-400 dark:border-black-400 dark:bg-black-400 dark:placeholder:text-gray-400"
            />
            <input
              id="name_input"
              placeholder="Team Name"
              maxLength={20}
              onChange={(e) => setName_out(e.target.value)}
              type="text"
              className="rounded-md border-2 border-green-500 bg-green-600 px-1 placeholder:text-black-400 dark:border-black-400 dark:bg-black-400 dark:placeholder:text-gray-400"
            />
          </div>
          <div className="flex h-96 w-full flex-row flex-wrap items-center justify-around gap-4 overflow-y-auto border-2 border-blue-300 bg-blue-100 py-1 px-4 shadow-inner dark:border-black-700 dark:bg-black-500">
            {logos.map((logo) => (
              <div
                className={`${
                  is_icon_focused[logo.index]
                    ? 'scale-105 animate-pulse'
                    : 'outline-none'
                } relative h-16 w-16 overflow-hidden rounded-md  hover:scale-105 hover:cursor-pointer hover:bg-blue-300  dark:hover:bg-black-400`}
                onClick={() => {
                  toggleIconFocus(logo.index)
                  setIcon_out(logo.index)
                }}
                tabIndex={0}
              >
                <Image
                  style={{ backgroundColor: selectedColour }}
                  key={logo.src}
                  className=""
                  src={logo.src}
                  alt=""
                  layout="fill"
                  objectFit="contain"
                ></Image>
              </div>
            ))}
          </div>
          <div className="flex h-10 w-full flex-row justify-between gap-3 sm:justify-start md:justify-between">
            {colours.map((colour) => (
              <div
                style={{ backgroundColor: colour }}
                className="h-10 w-10 border-2 border-black-800 hover:scale-105 hover:cursor-pointer dark:border-black-800"
                onClick={(e) => {
                  setSelectedColour(colour)
                  setColour_out(colour)
                }}
              ></div>
            ))}
          </div>
        </div>
        <Button
          text="Create"
          type="positive"
          onClick={() => createTeam()}
          fixedWidth
          fixedHeight
        ></Button>
      </div>
    </div>
  )
}

export default CreateTeamModal
