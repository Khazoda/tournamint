import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import {
  IoSettingsOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from 'react-icons/io5'
import { useUser } from '../../../context/UserContext'

export interface Props {
  is_dark: boolean
  setDark: Function
  userData: any
}

export default function Navbar(props: Props) {
  const { is_dark = false, setDark = null, userData = {}, ...restProps } = props
  const { displayName, biography, ign, setUserDetails } = useUser()

  return (
    <div className="fixed z-50 flex h-20 w-full flex-row-reverse items-center justify-between border-b-white-500 bg-white-200 px-3 py-1 drop-shadow-md dark:border-b-black-500 dark:bg-black-600 md:border-b-[1px]">
      {/* Profile */}
      <div className="inline-flex min-w-[300px] place-content-end text-right ">
        <div className="flex flex-col items-end justify-between pr-3">
          <div className="flex content-center gap-2">
            <button title="Change Theme" onClick={() => setDark?.(!is_dark)}>
              {is_dark ? (
                <IoSunnyOutline className="h-full w-full hover:text-green-500"></IoSunnyOutline>
              ) : (
                <IoMoonOutline className="h-full w-full hover:text-green-500"></IoMoonOutline>
              )}
            </button>
            <Link href="/settings">
              <div className="hover:cursor-pointer">
                <IoSettingsOutline
                  title="settings"
                  className="h-full w-full hover:text-green-500"
                ></IoSettingsOutline>
              </div>
            </Link>
            <button className="w-24 border-2 px-2 hover:border-green-500 hover:text-green-500">
              Log Out
            </button>
          </div>
          <span className="text-">{displayName}</span>
        </div>
        <Link href="/profile">
          <div
            title="View Profile"
            className="group relative inline h-[60px] w-[60px] border-2 border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 "
          >
            <Image
              src={
                userData.profileIconId === undefined
                  ? '/images/spinner.svg'
                  : 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
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
        <Link href="/">
          <a href="" className="font-heading hover:font-bold">
            Home
          </a>
        </Link>
        <Link href="/">
          <a href="" className="font-heading hover:font-bold">
            Ipsum
          </a>
        </Link>
        <Link href="/">
          <a href="" className="font-heading hover:font-bold">
            Sit
          </a>
        </Link>
        <Link href="/">
          <a href="" className="font-heading hover:font-bold">
            Dolor
          </a>
        </Link>
      </div>
      {/* Logo */}
      <div className="flex min-w-[300px] align-middle">
        <Link href="/">
          <a
            title="Home"
            className="inline-block h-[60px] min-h-[60px] w-[176px] min-w-[176px] text-left hover:cursor-pointer hover:drop-shadow-md "
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
