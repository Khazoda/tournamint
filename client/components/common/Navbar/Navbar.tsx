import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import {
  IoSettingsOutline,
  IoSunnyOutline,
  IoMoonOutline,
} from 'react-icons/io5'

export interface Props {
  is_dark: boolean
  setDark: Function
}

export default function Navbar(props: Props) {
  const { is_dark = false, setDark = null, ...restProps } = props

  return (
    <div className="fixed flex h-20 w-full flex-col items-center justify-between border-b-white-500 bg-white-200 px-3 py-1 drop-shadow-md dark:border-b-black-500 dark:bg-black-600 md:flex-row-reverse md:border-b-[1px]">
      {/* Profile */}
      <div className="inline-flex w-full place-content-end text-right ">
        <div className="flex flex-col items-end justify-between pr-3">
          <div className="flex content-center gap-2">
            <button title="Change Theme" onClick={() => setDark?.(!is_dark)}>
              {is_dark ? (
                <IoSunnyOutline className="h-full w-full hover:text-green-500"></IoSunnyOutline>
              ) : (
                <IoMoonOutline className="h-full w-full hover:text-green-500"></IoMoonOutline>
              )}
            </button>
            <button title="Settings">
              <IoSettingsOutline className="h-full w-full hover:text-green-500"></IoSettingsOutline>
            </button>
            <button className="w-24 border-2 px-2 hover:border-green-500 hover:text-green-500">
              Log Out
            </button>
          </div>
          <span className="">June loves kegs</span>
        </div>
        <div
          title="View Profile"
          className="group relative inline h-[60px] w-[60px] border-2 border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 "
        >
          <Image
            src="http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/503.png"
            alt="Profile picture"
            layout="fill"
            objectFit="cover"
            className=""
          ></Image>
          <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
            106
          </span>
        </div>
      </div>
      {/* Navbar */}
      <div className="inline-flex w-full justify-center gap-3">
        <Link href="/">
          <a href="" className="border-b-2 border-b-green-500">
            Home
          </a>
        </Link>
        <Link href="/">
          <a href="" className="border-b-2 border-b-green-500">
            Ipsum
          </a>
        </Link>
        <Link href="/">
          <a href="" className="border-b-2 border-b-green-500">
            Sit
          </a>
        </Link>
        <Link href="/">
          <a href="" className="border-b-2 border-b-green-500">
            Dolor
          </a>
        </Link>
      </div>
      {/* Logo */}
      <div
        title="Home"
        className="inline-block w-full text-left hover:cursor-pointer"
      >
        <Image src="/images/logo.png" height={70} width={70}></Image>
      </div>
    </div>
  )
}
