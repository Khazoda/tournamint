import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../components/common/Button'
import Image from 'next/image'
import { FiAward, FiCheckCircle } from 'react-icons/fi'
import { CgArrowRightR } from 'react-icons/cg'
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
  const [name, setName] = useState<string>('Default')
  const [bio, setBio] = useState<string>('Default Biography')
  const [ig, setIgn] = useState<string>('Default')

  const [buttonActive, setButtonActive] = useState<boolean>(false)
  const [text, setText] = useState<string>('Save Changes')

  const [splashURL, setSplashURL] = useState<string>(
    'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_4.jpg'
  )

  // [favouriteChampion,autocomplete_suggestion] - schema
  const [favouriteChampion, setFavouriteChampion] = useState<Array<string>>([
    'Teemo',
    'Teemo',
  ])

  const handleUserDetailsFormSubmit = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == 'Enter') {
      e.preventDefault()
      saveUserDetails()
    }
  }

  const Capitalize = (i: string) => {
    let result: string = ''
    if (i.length >= 2) {
      result =
        i.substring(0, 1).toUpperCase() + i.substring(1, i.length).toLowerCase()
    } else if (i.length == 1) {
      result = i.toUpperCase()
    } else {
      result = i
    }
    return result
  }
  const CHAMPIONS = [
    'aatrox',
    'ahri',
    'akali',
    'akshan',
    'alistar',
    'amumu',
    'anivia',
    'annie',
    'aphelios',
    'ashe',
    'aurelionsol',
    'azir',
    'bard',
    'blitzcrank',
    'brand',
    'braum',
    'caitlyn',
    'camille',
    'cassiopeia',
    'chogath',
    'corki',
    'darius',
    'diana',
    'draven',
    'drmundo',
    'ekko',
    'elise',
    'evelynn',
    'ezreal',
    'fiddlesticks',
    'fiora',
    'fizz',
    'galio',
    'gangplank',
    'garen',
    'gnar',
    'gragas',
    'graves',
    'gwen',
    'hecarim',
    'heimerdinger',
    'illaoi',
    'irelia',
    'ivern',
    'janna',
    'jarvaniv',
    'jax',
    'jayce',
    'jhin',
    'jinx',
    'kaisa',
    'kalista',
    'karma',
    'karthus',
    'kassadin',
    'katarina',
    'kayle',
    'kayn',
    'kennen',
    'khazix',
    'kindred',
    'kled',
    'kogmaw',
    'leblanc',
    'leesin',
    'leona',
    'lillia',
    'lissandra',
    'lucian',
    'lulu',
    'lux',
    'malphite',
    'malzahar',
    'maokai',
    'masteryi',
    'missfortune',
    'monkeyking',
    'mordekaiser',
    'morgana',
    'nami',
    'nasus',
    'nautilus',
    'neeko',
    'nidalee',
    'nocturne',
    'nunu',
    'olaf',
    'orianna',
    'ornn',
    'pantheon',
    'poppy',
    'pyke',
    'qiyana',
    'quinn',
    'rakan',
    'rammus',
    'reksai',
    'rell',
    'renata',
    'renekton',
    'rengar',
    'riven',
    'rumble',
    'ryze',
    'samira',
    'sejuani',
    'senna',
    'seraphine',
    'sett',
    'shaco',
    'shen',
    'shyvana',
    'singed',
    'sion',
    'sivir',
    'skarner',
    'sona',
    'soraka',
    'swain',
    'sylas',
    'syndra',
    'tahmkench',
    'taliyah',
    'talon',
    'taric',
    'teemo',
    'thresh',
    'tristana',
    'trundle',
    'tryndamere',
    'twistedfate',
    'twitch',
    'udyr',
    'urgot',
    'varus',
    'vayne',
    'veigar',
    'velkoz',
    'vex',
    'vi',
    'viego',
    'viktor',
    'vladimir',
    'volibear',
    'warwick',
    'xayah',
    'xerath',
    'xinzhao',
    'yasuo',
    'yone',
    'yorick',
    'yuumi',
    'zac',
    'zed',
    'zeri',
    'ziggs',
    'zilean',
    'zoe',
    'zyra',
  ]
  const ALPHABET = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ]
  const handleFavouriteChampionFormSubmit = (e: any) => {
    let value = e.target.value
    // Submit Form
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        saveUserDetails()
        break
      case 'ArrowRight':
        e.preventDefault()
        setFavouriteChampion([favouriteChampion[1], favouriteChampion[1]])
        e.target.value = Capitalize(favouriteChampion[1])
        // setFavouriteChampion([favouriteChampion[0], ''])
        triggerSplashUpdate()
        break
      default:
        if (value != undefined) {
          // Capitalize first letter
          e.target.value = Capitalize(value)
          if (e.target.value != '') {
            let match = CHAMPIONS.filter((event) =>
              event.startsWith(e.target.value.toLowerCase())
            )[0]
            setFavouriteChampion([Capitalize(value), match])
            if (value?.toLowerCase() == match?.toLowerCase()) {
              triggerSplashUpdate(match)
            }
          }
        }
        break
    }
  }
  const triggerSplashUpdate = (match?: string | any[]) => {
    // Update splash art
    if (match == undefined) {
      setSplashURL(
        'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
          Capitalize(favouriteChampion[0]) +
          '_0.jpg'
      )
    } else if (match?.length > 0) {
      setSplashURL(
        'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
          Capitalize(favouriteChampion[1]) +
          '_0.jpg'
      )
    }
  }
  const saveUserDetails = () => {
    console.log('USER DETAILS SAVED')

    if (setUserDetails != null) {
      if (localStorage !== null) {
        if (localStorage.userDetails == null) {
          localStorage.userDetails = JSON.stringify({
            displayName: 'displayName',
            biography: 'biography',
            ign: 'Tryndamere',
            favouriteChampion: ['Tryndamere', ''],
          })
        } else {
          if (CHAMPIONS.includes(favouriteChampion[0])) {
            setUserDetails(name, bio, ig, favouriteChampion[0], { name: 'sus' })
            localStorage.setItem(
              'userDetails',
              JSON.stringify({
                displayName: name,
                biography: bio,
                ign: ig,
                favouriteChampion: Capitalize(favouriteChampion[0]),
                rankInfo: {
                  tier: userData.tier,
                  rank: userData.rank,
                  wins: userData.wins,
                  losses: userData.losses,
                },
              })
            )
            setText('Profile Saved')
            setButtonActive(true)

            setTimeout(() => {
              setText('Save Changes')
              setButtonActive(false)
            }, 1500)
          } else {
            setText('Invalid Champion')

            setTimeout(() => {
              setText('Save Changes')
              setButtonActive(false)
            }, 1500)
          }

          if (refreshUserInfo !== null) {
            refreshUserInfo()
          }
        }
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem('userDetails') != null) {
      let details = JSON.parse(localStorage.getItem('userDetails') as string)

      setName(details.displayName)
      setBio(details.biography)
      setIgn(details.ign)
      setFavouriteChampion([details.favouriteChampion, ''])
    }
  }, [])

  setTimeout(() => {
    triggerSplashUpdate()
  }, 200)
  return (
    <div className="flex min-h-screen flex-col justify-center py-24 px-12 sm:flex-row">
      {/* Profile Showcase */}
      <div className="flex flex-col items-center gap-3 text-center">
        {/* IN GAME NAME */}
        <div className=" min-w-[250px] max-w-[250px] overflow-x-hidden overflow-ellipsis rounded-md bg-gray-200 px-3 py-2 drop-shadow-lg dark:bg-black-500">
          {ign}
        </div>
        {/* PROFILE PICTURE */}
        <div className="relative h-0 w-full  rounded-md bg-gray-200 pb-[100%] drop-shadow-lg dark:bg-black-500">
          {/* SPLASH ART BACKGROUND */}
          <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-gray-300 shadow-inner dark:bg-black-600">
            <Image src={splashURL} layout="fill" objectFit="cover"></Image>
          </div>
          <div className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-y-1/2 -translate-x-1/2 border-2 border-green-500 bg-gray-200 dark:bg-black-500">
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
                src={
                  userData.tier === undefined
                    ? '/images/spinner.svg'
                    : '/images/ranks/' + userData.tier + '.png'
                }
                layout="fill"
                objectFit="contain"
              ></Image>
              {/* Level */}
              <span className="absolute top-2 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-2 border-blue-500 bg-gray-100 px-2 text-center text-sm capitalize dark:bg-gray-800">
                {userData.summonerLevel === undefined
                  ? 'Iron III'
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
        {userData.wins == 0 || userData.losses == 0 ? (
          <></>
        ) : (
          <div className="relative grid w-full grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 rounded-md bg-gray-200 p-3 pt-2 drop-shadow-lg dark:bg-black-500">
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
              </span>
              <span className="absolute right-0">Winrate</span>
            </div>
          </div>
        )}
      </div>

      {/* Right hand side */}
      <div className=" mx-0 my-3 max-h-[250px] min-h-[120px] w-full min-w-[250px] overflow-clip  break-words rounded-md bg-gray-200 p-3 pt-2 drop-shadow-lg dark:bg-black-500 sm:my-0 sm:mx-3 sm:w-[250px]">
        <p className="w-full font-heading text-lg font-semibold underline-offset-1 dark:text-green-600">
          {name?.length <= 16
            ? name
            : 'Too long! Try shortening your display name.'}
        </p>
        <p className="">
          {bio?.length <= 160 ? bio : 'Too long! Try shortening your bio.'}
        </p>
      </div>

      {/* Input Fields */}
      <ul className="items-between flex h-full flex-col rounded-md bg-gray-200 p-3 pt-2 dark:bg-black-500">
        <h1 className="font-header inline align-top text-2xl  dark:text-green-500">
          Edit Profile
        </h1>
        <li className="mb-2 flex flex-col">
          <label htmlFor="username_input">Username</label>
          <input
            id="username_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-transparent px-1"
            defaultValue={displayName}
            onKeyUp={(e) => handleUserDetailsFormSubmit(e)}
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
            onKeyUp={(e) => handleUserDetailsFormSubmit(e)}
            onChange={(e) => setBio(e.target.value)}
          />
        </li>
        <li className="mb-2 flex flex-col">
          <label htmlFor="in-game_input">In-Game Name</label>
          <input
            id="in-game_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-transparent px-1"
            defaultValue={ign}
            onKeyUp={(e) => handleUserDetailsFormSubmit(e)}
            onChange={(e) => setIgn(e.target.value)}
          />
        </li>
        <li className="mb-4 flex flex-col">
          <label htmlFor="in-game_input">Favourite Champion</label>
          <div className="relative h-7 ">
            <div className="pointer-events-none absolute top-0 left-0 rounded-md border-2 border-transparent bg-transparent px-1 lowercase text-gray-600 first-letter:capitalize dark:text-white-600">
              {favouriteChampion == undefined ? '' : favouriteChampion[1]}
            </div>
            <input
              id="in-game_input"
              autoComplete="off"
              type="text"
              className="absolute top-0 left-0 rounded-md border-2 border-black-400 bg-transparent px-1  text-black-900 first-letter:capitalize dark:text-white-100"
              defaultValue={
                favouriteChampion == undefined ? '' : favouriteChampion[0]
              }
              onKeyUp={(e) => {
                handleFavouriteChampionFormSubmit(e)
              }}
            />
            <div
              className={
                `${favouriteChampion[1]?.length > 0 ? 'visible' : 'hidden'}` +
                ' absolute right-[0.2rem] top-1/2 h-6 w-6 -translate-y-1/2 animate-pulse'
              }
            >
              <CgArrowRightR className="absolute" size={24} />
            </div>
          </div>
        </li>
        <li>
          <Button
            type="positive"
            text={text}
            noMargin
            acceptCharset
            className="relative"
            icon={
              <FiCheckCircle
                className={
                  `${buttonActive ? ' visible ' : ' invisible '}` +
                  'absolute left-6 top-1/2 -translate-y-1/2 animate-pulse self-center'
                }
              ></FiCheckCircle>
            }
            onClick={() => saveUserDetails()}
          ></Button>
        </li>
      </ul>
    </div>
  )
}

export default Profile
