import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Button from '../components/common/Button'
import Image from 'next/image'
import { useStore } from '../store'

export interface Props {
  localStorage: Storage
  userData: any
  refreshUserInfo: Function
  store?: any
}

export interface UserDetails {
  username?: string
  biography?: string
  ign?: string
}

function Profile(props: Props) {
  const [userDetails, setUserDetails] = useState<UserDetails>()
  const store = { useStore }
  console.log(store)

  const {
    localStorage = null,
    userData = {},
    refreshUserInfo = null,
    ...restProps
  } = props

  function saveChanges() {
    if (localStorage !== null) {
      if (localStorage.userDetails == null) {
        localStorage.userDetails = JSON.stringify({
          username: 'username',
          biography: 'biography',
          ign: 'Tryndamere',
        })
      } else {
        if (
          userDetails?.username != null &&
          userDetails.biography != null &&
          userDetails.ign != null
        ) {
          localStorage.userDetails = JSON.stringify(userDetails)
          if (refreshUserInfo !== null) {
            refreshUserInfo()
          }
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-24 md:py-32">
      <div className="flex flex-col items-center gap-4 font-body md:flex-row md:items-start">
        <div
          id="profile_preview"
          className="flex flex-row rounded-md border-2 md:h-[250px] md:w-[500px]"
        >
          {/* Left hand side */}
          <div
            id="profile_section_left"
            className="flex h-full w-full flex-col"
          >
            <div
              id="avatar_display"
              className="relative h-full w-full border-r-2"
            >
              <div className="relative min-h-full min-w-full brightness-50">
                <Image
                  src="/images/ahri_splash.jpg"
                  layout="fill"
                  objectFit="cover"
                ></Image>
              </div>
              <div className="absolute top-1/4 left-3/4 h-1/2 w-1/2 rounded-full border-2">
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
                  className="rounded-full"
                ></Image>
              </div>
            </div>
          </div>

          {/* Right hand side */}
          <div className="right relative flex h-full w-full flex-col justify-center gap-3 ">
            <p className="text-header relative w-full text-center text-lg font-semibold underline">
              {userDetails?.username}
            </p>
            <p className="text-header font-regular relative w-full pr-6 text-right text-lg">
              {userDetails?.biography}
            </p>
            <p className="text-header font-regular relative  w-full text-center text-lg">
              {userDetails?.ign}
            </p>
          </div>
        </div>

        <ul>
          <h1 className="font-header text-4xl text-green-500">Edit Profile</h1>
          <li className="mb-2 flex flex-col">
            <label htmlFor="username_input">Username</label>
            <input
              id="username_input"
              type="text"
              className="rounded-md border-2 border-black-400 bg-transparent"
              onChange={(e) =>
                setUserDetails({
                  username: e.target.value,
                  biography: userDetails?.biography,
                  ign: userDetails?.ign,
                })
              }
            />
          </li>
          <li className="mb-2 flex flex-col">
            <label htmlFor="biography_input">Biography</label>
            <input
              id="biography_input"
              type="text"
              className="rounded-md border-2 border-black-400 bg-transparent"
              onChange={(e) =>
                setUserDetails({
                  biography: e.target.value,
                  username: userDetails?.username,
                  ign: userDetails?.ign,
                })
              }
            />
          </li>
          <li className="mb-4 flex flex-col">
            <label htmlFor="in-game_input">In-Game Name</label>
            <input
              id="in-game_input"
              type="text"
              className="rounded-md border-2 border-black-400 bg-transparent"
              onChange={(e) =>
                setUserDetails({
                  ign: e.target.value,
                  username: userDetails?.username,
                  biography: userDetails?.biography,
                })
              }
            />
          </li>
          <li>
            <Button
              type="positive"
              text="Save Changes"
              noMargin
              onClick={() => saveChanges()}
            ></Button>
          </li>
        </ul>
      </div>
      {/* {userData.length !== 0 && (
            <>
              <div className="relative h-20 w-20">
                <Image
                  src={
                    'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                    userData.profileIconId +
                    '.png'
                  }
                  alt="Profile picture"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                ></Image>
              </div>
              <div>
                {userData.name} Level: {userData.summonerLevel}
              </div>
              </> */}
    </div>
  )
}

export default Profile
