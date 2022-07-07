import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import {
  IoSettingsOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from 'react-icons/io5'
import { useUser } from '../../../context/UserContext'
import '/globals/riot_consts'
import { DD_PREFIX } from '../../../globals/riot_consts'
import { useRouter } from 'next/router'

export interface Props {
  is_dark: boolean
  setDark: Function
  userData: any
}

export default function Navbar(props: Props) {
  const { is_dark = false, setDark = null, userData = {}, ...restProps } = props
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
  } = useUser()
  const router = useRouter()

  const handleLogOut = () => {
    if (setUserDetails != null) {
      if (localStorage !== null) {
        setUserDetails(
          '',
          '',
          '',
          '',
          {
            wins: 0,
            losses: 0,
            tier: '',
            rank: '',
          },
          {
            tournaments_played: 0,
            tournaments_won: 0,
            matches_won: 0,
            people_met: 0,
          },
          0,
          '',
          null
        )

        localStorage.removeItem('userDetails')
        router.push('/')
      }
    }
  }
  return (
    <div className="fixed z-50 flex h-20 w-full flex-row-reverse items-center justify-between border-b-white-500 bg-white-200 px-3 py-1 drop-shadow-md dark:border-b-black-500 dark:bg-black-600 md:border-b-[1px]">
      {/* Profile */}
      <div className="inline-flex place-content-end text-right ">
        <div className="flex w-8 flex-col items-end justify-between pr-1 md:w-auto md:pr-3">
          <div className="flex h-full flex-col content-center gap-1 md:h-auto md:flex-row ">
            <button
              title="Change Theme"
              className=" h-8 w-8 rounded-sm border-2 border-gray-500 hover:border-cyan-400 dark:hover:border-cyan-700"
              onClick={() => setDark?.(!is_dark)}
            >
              {is_dark ? (
                <IoSunnyOutline className="h-full w-full hover:bg-cyan-900  "></IoSunnyOutline>
              ) : (
                <IoMoonOutline className="h-full w-full  hover:bg-cyan-200 "></IoMoonOutline>
              )}
            </button>
            <Link href="/settings">
              <div className="h-8 w-8 rounded-sm border-2 border-gray-500 hover:cursor-pointer hover:border-cyan-400 hover:bg-cyan-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-900">
                <IoSettingsOutline
                  title="settings"
                  className="h-full w-full"
                ></IoSettingsOutline>
              </div>
            </Link>
            <button
              onClick={() => handleLogOut()}
              className="hidden w-24 border-2 border-gray-500 px-2 hover:border-red-800 hover:bg-red-200 dark:hover:border-red-500 dark:hover:bg-red-900 md:block"
            >
              Log Out
            </button>
          </div>
          <span className="hidden md:block">{displayName}</span>
        </div>
        <Link href="/profile">
          <div
            title="View Profile"
            className="group relative inline h-[68px] w-[68px] border-2 border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
          >
            <Image
              src={
                userData.profileIconId === undefined
                  ? '/images/spinner.svg'
                  : DD_PREFIX +
                    'img/profileicon/' +
                    userData.profileIconId +
                    '.png'
              }
              alt="Profile picture"
              layout="fill"
              objectFit="cover"
              className=""
            ></Image>
            <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
              {userData.summonerLevel === undefined
                ? '666'
                : userData.summonerLevel}
            </span>
          </div>
        </Link>
      </div>
      {/* Navbar */}
      <div className="hidden justify-center gap-3 lg:inline-flex">
        <Link href="/my_teams">
          <a href="" className="font-heading hover:font-bold">
            My Team
          </a>
        </Link>
      </div>
      {/* Logo */}
      <div className="flex align-middle">
        <Link href="/main">
          <a
            title="Home"
            className="inline-block h-[60px] min-h-[60px] w-[176px] min-w-[176px] text-left hover:translate-y-0.5 hover:cursor-pointer hover:drop-shadow-md "
          >
            <Image
              src={is_dark ? '/images/logo_dark.svg' : '/images/logo.svg'}
              height={60}
              width={150}
              quality={100}
            ></Image>
          </a>
        </Link>
      </div>
    </div>
  )
}
