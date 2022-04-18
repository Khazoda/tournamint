import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../components/common/Button'
import Image from 'next/image'
import { FiAward } from 'react-icons/fi'
import { useUser, userContextType } from '../context/UserContext'

export interface Props {
  localStorage: Storage
  userData: any
  refreshUserInfo: Function
  store?: any
}
export interface UserDetails {
  displayName?: string
  biography?: string
  ign?: string
}

function Profile(props: Props) {
  const { userData = {}, refreshUserInfo = null, ...restProps } = props

  // User Details Properties
  const { displayName, biography, ign, setUserDetails } = useUser()
  const [name, setName] = useState<string>('')
  const [bio, setBio] = useState<string>('')
  const [ig, setIgn] = useState<string>('')

  const [favouriteChampion, setFavouriteChampion] = useState<string>('Akali')

  const saveUserDetails = () => {
    if (setUserDetails != null) {
      if (localStorage !== null) {
        if (localStorage.userDetails == null) {
          localStorage.userDetails = JSON.stringify({
            displayName: 'displayName',
            biography: 'biography',
            ign: 'Tryndamere',
            favouriteChampion: 'Tryndamere',
          })
        } else {
          {
            setUserDetails(name, bio, ig, { name: 'sus' })
            localStorage.setItem(
              'userDetails',
              JSON.stringify({
                displayName: name,
                biography: bio,
                ign: ig,
                favouriteChampion: favouriteChampion,
                rankInfo: {
                  tier: userData.tier,
                  rank: userData.rank,
                  wins: userData.wins,
                  losses: userData.losses,
                },
              })
            )
            if (refreshUserInfo !== null) {
              refreshUserInfo()
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    let details = JSON.parse(localStorage.getItem('userDetails') as string)

    setName(details.displayName)
    setBio(details.biography)
    setIgn(details.ign)
    setFavouriteChampion(details.favouriteChampion)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-24 px-12 md:flex-row">
      {/* Profile Showcase */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* IN GAME NAME */}
        <div className=" min-w-[250px] max-w-[250px] overflow-x-hidden overflow-ellipsis rounded-md bg-gray-200 px-3 py-2 drop-shadow-lg dark:bg-black-500">
          {ign}
        </div>
        {/* PROFILE PICTURE */}
        <div className="relative h-0 w-full  rounded-md bg-gray-200 pb-[100%] drop-shadow-lg dark:bg-black-500">
          {/* SPLASH ART BACKGROUND */}
          <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-sm drop-shadow-sm">
            <Image
              src={
                'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
                favouriteChampion +
                '_0.jpg'
              }
              priority
              layout="fill"
              objectFit="cover"
            ></Image>
          </div>
          <div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-y-1/2 -translate-x-1/2 border-2 border-green-500 ">
            <Image
              src={
                'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                (userData.profileIconId === undefined
                  ? '503'
                  : userData.profileIconId) +
                '.png'
              }
              alt="Profile picture"
              layout="fill"
              objectFit="cover"
              className=""
            ></Image>
            {/* Level */}
            <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200">
              {userData.summonerLevel === undefined
                ? '666'
                : userData.summonerLevel}
            </span>
          </div>
        </div>
        {/* TROPHIES & RANK */}
        <div className="relative flex h-[250px] w-full flex-row gap-2 drop-shadow-lg">
          <div className="relative flex h-full w-full items-center justify-start rounded-md bg-gray-200 p-3 dark:bg-black-500">
            <div className="h-full w-full rounded-sm drop-shadow-sm">
              <Image
                src={'/images/ranks/' + userData.tier + '.png'}
                layout="fill"
                objectFit="contain"
              ></Image>
              {/* Level */}
              <span className="absolute top-2 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-blue-500 bg-gray-100 px-2 text-center text-sm capitalize dark:bg-gray-800">
                {userData.summonerLevel === undefined
                  ? 'Iron V'
                  : userData.tier + ' ' + userData.rank}
              </span>
            </div>
          </div>
          <div className="flex w-12 flex-col justify-around gap-1 rounded-md bg-gray-200 p-1 dark:bg-black-500">
            <FiAward
              title="Valerian Cup 2019"
              color="green"
              fill="lime"
              className="h-full w-full"
            ></FiAward>
            <FiAward
              title="Elder Cup 2022"
              color="#7777EE"
              fill="aqua"
              className="h-full w-full"
            ></FiAward>
            <FiAward
              title="Guildford Friendly 2021"
              color="grey"
              fill="darkgrey"
              className="h-full w-full"
            ></FiAward>
            <FiAward
              title="Guildford Friendly 2022"
              color="darkgrey"
              fill="grey"
              className="h-full w-full"
            ></FiAward>
          </div>
        </div>

        {/* WINRATE */}
        <div className="relative grid w-full grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 rounded-md bg-gray-200 p-2 drop-shadow-lg dark:bg-black-500">
          <div className="relative text-right">
            <span className="absolute left-0">Wins </span>
            <span className="text-green-700 dark:text-green-500">
              {userData.wins}
            </span>
          </div>
          <div className="relative text-left">
            <span className="text-red-500">{userData.losses}</span>
            <span className="absolute right-0"> Losses</span>
          </div>
          <div className="relative text-right">
            <span className="absolute left-0">Games </span>
            <span className="text-blue-500">
              {userData.wins + userData.losses}
            </span>
          </div>
          <div className="relative text-left">
            <span
              className={`${
                Number(
                  (
                    (userData.wins / (userData.losses + userData.wins)) *
                    100
                  ).toPrecision(3)
                ) >= 50
                  ? 'text-lime-700 dark:text-lime-500'
                  : 'text-orange-500'
              }`}
            >
              {(
                (userData.wins / (userData.losses + userData.wins)) *
                100
              ).toPrecision(3)}
              {''}%
            </span>
            <span className="absolute right-0">Winrate</span>
          </div>
        </div>
      </div>

      {/* Right hand side */}
      <div className=" ">
        <p className="">{displayName}</p>
        <p className="">{biography}</p>
        <p className="">{ign}</p>
      </div>

      {/* Input Fields */}
      <ul>
        <h1 className="font-header text-4xl text-green-500">Edit Profile</h1>
        <li className="mb-2 flex flex-col">
          <label htmlFor="username_input">Username</label>
          <input
            id="username_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-transparent px-1"
            defaultValue={displayName}
            onChange={(e) => setName(e.target.value)}
          />
        </li>
        <li className="mb-2 flex flex-col">
          <label htmlFor="biography_input">Biography</label>
          <input
            id="biography_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-transparent px-1"
            defaultValue={biography}
            onChange={(e) => setBio(e.target.value)}
          />
        </li>
        <li className="mb-4 flex flex-col">
          <label htmlFor="in-game_input">In-Game Name</label>
          <input
            id="in-game_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-transparent px-1"
            defaultValue={ign}
            onChange={(e) => setIgn(e.target.value)}
          />
        </li>
        <li className="mb-4 flex flex-col">
          <label htmlFor="in-game_input">Favourite Champion</label>
          <input
            id="in-game_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-transparent px-1"
            defaultValue={favouriteChampion}
            onChange={(e) => setFavouriteChampion(e.target.value)}
          />
        </li>
        <li>
          <Button
            type="positive"
            text="Save Changes"
            noMargin
            acceptCharset
            onClick={() => saveUserDetails()}
          ></Button>
        </li>
      </ul>
    </div>
  )
}

export default Profile
