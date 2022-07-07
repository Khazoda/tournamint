import axios from 'axios'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { Props, useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'

const Home: NextPage = (props) => {
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
  const [name_input, setName_input] = useState<string>('')

  var seed_data = {
    displayName: name_input || 'default',
    biography: 'This is a default biography',
    ign: name_input || 'default',
    favouriteChampion: 'Teemo',
    rankInfo: {
      tier: 'iron',
      rank: 'IV',
      wins: 0,
      losses: 0,
    },
    statistics: {
      tournaments_played: 0,
      tournaments_won: 0,
      matches_won: 0,
      people_met: 0,
    },
    tournamentsMade: 0,
    tournaments: null,
    team: null,
  }

  const checkName = async () => {
    let valid_lol_name: boolean = false
    let db_name_exists: boolean = false
    const url = '/api/login?' + new URLSearchParams({ ign: name_input })

    const result: any = await fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('HTTP status ' + res.status)
        }
        return res.json()
      })
      .then((res) => {
        console.log(res)
        try {
          if (res.status == 400) {
            alert('TODO: tell user to enter valid name')
          } else {
            valid_lol_name = true
            alert('valid :)')
          }
        } catch (error) {}
      })
      .catch((res) => console.log('Error:', res.error))

    // TODO: check db for ign under accounts hash

    // // // !Guard Clauses
    if (!valid_lol_name) return false
    if (!db_name_exists) return false
    populateUserData()
  }
  const populateUserData = () => {
    if (setUserDetails != null) {
      if (localStorage !== null) {
        setUserDetails(
          seed_data.displayName,
          seed_data.biography,
          seed_data.ign,
          seed_data.favouriteChampion,
          {
            wins: seed_data.rankInfo.wins,
            losses: seed_data.rankInfo.losses,
            tier: seed_data.rankInfo.tier,
            rank: seed_data.rankInfo.rank,
          },
          {
            tournaments_played: seed_data.statistics.tournaments_played,
            tournaments_won: seed_data.statistics.tournaments_won,
            matches_won: seed_data.statistics.matches_won,
            people_met: seed_data.statistics.people_met,
          },
          seed_data.tournamentsMade,
          seed_data.tournaments,
          seed_data.team
        )

        localStorage.setItem(
          'userDetails',
          JSON.stringify({
            displayName: seed_data.displayName,
            biography: seed_data.biography,
            ign: seed_data.ign,
            favouriteChampion: seed_data.favouriteChampion,
            rankInfo: {
              tier: seed_data.rankInfo.tier,
              rank: seed_data.rankInfo.rank,
              wins: seed_data.rankInfo.wins,
              losses: seed_data.rankInfo.losses,
            },
            statistics: {
              tournaments_played: seed_data.statistics.tournaments_played,
              tournaments_won: seed_data.statistics.tournaments_won,
              matches_won: seed_data.statistics.matches_won,
              people_met: seed_data.statistics.people_met,
            },
            tournamentsMade: seed_data.tournamentsMade,
            tournaments: seed_data.tournaments,
            team: seed_data.team,
          })
        )
      }
    }
  }

  return (
    <div className="hero absolute z-50 h-full min-h-screen w-full bg-base-200 bg-gradient-to-br from-[#009c53] to-[#005d92] font-heading">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="images/logo_detailed.png"
          className="max-w-sm rounded-lg drop-shadow-lg"
        />
        <div className="rounded-lg border-2 border-white-500 bg-[rgba(255,255,255,0.2)] p-5 drop-shadow-md">
          <h1 className="text-2xl font-bold">Welcome to </h1>
          <h1 className="text-5xl font-bold">Tournamint</h1>
          <br />
          <p className="min-w-max py-6 text-lg">
            Please enter your in-game League of Legends® name to get started
          </p>
          <form
            className="flex w-full flex-row justify-between gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              return false
            }}
          >
            <input
              type="text"
              placeholder="Start typing..."
              className="input input-bordered input-primary w-full max-w-md text-black-600"
              onChange={(e: any) => setName_input(e.target.value)}
            />
            <button onClick={() => checkName()} className="btn btn-primary">
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
