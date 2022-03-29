import axios from 'axios'
import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'

let body: HTMLBodyElement | null = null
let localStorage: Storage
export interface Props {
  is_dark: boolean
  setDark: Function
}
const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props

  const [searchQuery, setSearchQuery] = useState('')
  const [gameList, setGameList] = useState([])

  function getPlayerGames(event?: Event) {
    axios
      .get('http://localhost:4000/past5Games')
      .then(function (response) {
        setGameList(response.data)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  console.log(gameList)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 dark:bg-black-700 dark:text-white-100">
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center ">
        <input type="text" className="bg-black-400 outline-black-400" />
        <button onClick={(e) => getPlayerGames()}>Search</button>
        {console.log(gameList)}{' '}
        {gameList.length !== 0 && (
          <>
            <p>Data!</p>
            {gameList.map((gameData: any, index) => {
              ;<>
                <h2>Game {index + 1}</h2>
                <div>
                  {/* {gameData.info.participants.map(
                    (data: any, participantIndex: number) => (
                      <p>PLAYER {participantIndex + 1}</p>
                    )
                  )} */}
                </div>
              </>
            })}
          </>
        )}
      </main>
    </div>
  )
}

export default Home
