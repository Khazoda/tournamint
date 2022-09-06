import axios from 'axios'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Props, useEffect, useRef, useState } from 'react'
import { useUser } from '../context/UserContext'
import { Capitalize } from '../globals/global_functions'
import { IAccountData } from '../globals/types'

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
  const focusInputRef = useRef<any>(null)
  const passInputRef = useRef<any>(null)

  const [name_input, setName_input] = useState<string>('')
  const [pass_input, setPass_input] = useState<string>('')

  const [db_account_exists, setDb_account_exists] = useState<boolean>(false)

  const [account_data, setAccount_data] = useState<any>()

  const [show_popup, setShow_popup] = useState<boolean>(false)
  const [shake, setShake] = useState<boolean>(false)
  const [passcode_showing, setPasscode_showing] = useState<boolean>(false)

  const router = useRouter()

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
      log_ins: 0,
      tournaments_won: 0,
      matches_won: 0,
      people_met: 0,
    },
    tournamentsMade: 0,
    tournaments: null,
    team: null,
    settings: {
      centered_navbar: false
    }
  }

  useEffect(() => {
    // Autofocus name box
    if (focusInputRef.current) {
      focusInputRef.current.focus()
    }
  }, [])

  const checkName = async () => {
    let valid_lol_name: boolean = false
    const url = '/api/login?' + new URLSearchParams({ ign: name_input })

    // Check if name entered exists on Riot's EUW servers
    await fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('HTTP status ' + res.status)
        }
        return res.json()
      })
      .then((res) => {
        // console.log(res)
        try {
          if (res.status == 400) {
            // Invalid name popup
            setShow_popup(true)
            setTimeout(() => {
              setShow_popup(false)
            }, 3500)
          } else {
            valid_lol_name = true
          }
        } catch (error) { }
      })
      .catch((res) => console.log('Error:', res.error))

    if (valid_lol_name) {
      // Does account exist already?
      const account_api_url =
        '/api/account?' + new URLSearchParams({ ign: Capitalize(name_input) })
      const account_get_response = await fetch(account_api_url)
        .then((res) => res.json())
        .then(async (res) => {
          if (res.status == 'Account does not yet exist') {
            if (passInputRef.current) {
              passInputRef.current.focus()
            }
            setDb_account_exists(false)
            setPasscode_showing(true)
          } else {
            if (passInputRef.current) {
              passInputRef.current.focus()
            }
            setDb_account_exists(true)
            setPasscode_showing(true)
          }
        })
        .catch((res) => console.log(res.error))
    }
  }

  async function createAccount(ign: string, pass: string) {
    const dataOut: IAccountData = {
      ign: Capitalize(ign),
      username: Capitalize(ign),
      bio: 'Default Biography',
      favourite_champion: 'aatrox',
      passcode: pass,
      team_tag: 'ABC',
      tournament_id: 'ABC123',
      settings: {
        centered_navbar: false
      },
      statistics: {
        matches_won: 0,
        people_met: 0,
        log_ins: 0,
        tournaments_won: 0
      }

    }
    const account_post_response = await fetch('/api/account', {
      body: JSON.stringify({ data: dataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (account_post_response.status == 200) {
      // setAccount_data({ dataOut })
      // console.log(account_post_response)

      const team_data = await getTeamData(dataOut)
      const tournament_data = await getTournamentData(dataOut.tournament_id)
      populateUserData(dataOut, team_data, tournament_data)

      setTimeout(() => {
        window.location.href = '/profile'
      }, 500)
    }
  }

  async function loginAccount(ign: string, pass: string) {
    const url =
      '/api/account?' + new URLSearchParams({ ign: Capitalize(name_input) })

    // Check if name entered exists on Riot's EUW servers
    await fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('HTTP status ' + res.status)
        }
        return res.json()
      })
      .then(async (res) => {
        console.log(res)

        try {
          if (res.status == 400) {
            // Invalid name popup
            console.error('Invalid name entered')
          } else {
            if (pass_input == res.passcode) {
              // console.log(pass_input, res)

              // setAccount_data(res)
              const team_data = await getTeamData(res)
              const tournament_data = await getTournamentData(res.tournament_id)
              // console.log(team_data, tournament_data, res)

              populateUserData(res, team_data, tournament_data)
              setTimeout(() => {
                window.location.href = '/main'
              }, 500)
            } else {
              setShake(true)
              setTimeout(() => {
                setShake(false)
              }, 1500)
            }
          }
        } catch (error) { }
      })
      .catch((res) => console.log('Error:', res.error))
  }

  const getTeamData = async (account_data: any) => {
    // Get Team data from cloud
    const url =
      '/api/teamData?' +
      new URLSearchParams({ team_tag: account_data.team_tag })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    let team_temp = result.response
    return team_temp
  }
  const getTournamentData = async (tournament_id: string) => {
    //Get Tournament data from cloud
    const tournament_url =
      '/api/tournament/tournament?' + new URLSearchParams({ tournament_id })
    const tournament_result = await fetch(tournament_url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    let tournament_temp = tournament_result
    return tournament_temp
  }

  const populateUserData = async (
    account_data: any,
    team_data: any,
    tournament_data: any
  ) => {
    var new_log_ins = account_data.statistics.log_ins
    new_log_ins = new_log_ins + 1

    if (setUserDetails != null) {
      if (localStorage !== null) {
        setUserDetails(
          account_data.username,
          account_data.bio,
          account_data.ign,
          account_data.favourite_champion,
          {
            wins: seed_data.rankInfo.wins,
            losses: seed_data.rankInfo.losses,
            tier: seed_data.rankInfo.tier,
            rank: seed_data.rankInfo.rank,
          },
          {
            log_ins: new_log_ins,
            tournaments_won: account_data.statistics.tournaments_won,
            matches_won: account_data.statistics.matches_won,
            people_met: account_data.statistics.people_met,
          },
          seed_data.tournamentsMade,
          tournament_data,
          team_data,
          account_data.settings,
        )

        localStorage.setItem(
          'userDetails',
          JSON.stringify({
            displayName: account_data.username,
            biography: account_data.bio,
            ign: account_data.ign,
            favouriteChampion: account_data.favourite_champion,
            rankInfo: {
              tier: seed_data.rankInfo.tier,
              rank: seed_data.rankInfo.rank,
              wins: seed_data.rankInfo.wins,
              losses: seed_data.rankInfo.losses,
            },
            statistics: {
              log_ins: new_log_ins,
              tournaments_won: account_data.statistics.tournaments_won,
              matches_won: account_data.statistics.matches_won,
              people_met: account_data.statistics.people_met,
            },
            tournamentsMade: seed_data.tournamentsMade,
            tournaments: tournament_data,
            team: team_data,
            settings: account_data.settings,
          })
        )
      }
    }
    const dataOut: IAccountData = {
      ign: account_data.ign,
      username: account_data.username,
      bio: account_data.bio,
      favourite_champion: account_data.favourite_champion,
      passcode: account_data.passcode,
      team_tag: account_data.team_tag,
      tournament_id: account_data.tournament_id,
      settings: account_data.settings,
      statistics: {
        matches_won: account_data.statistics.matches_won,
        people_met: account_data.statistics.people_met,
        log_ins: new_log_ins,
        tournaments_won: account_data.statistics.tournaments_won
      }

    }
    const account_post_response = await fetch('/api/account', {
      body: JSON.stringify({ data: dataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
  }

  return (
    <div className="hero absolute z-50 h-full min-h-screen w-full bg-base-200 bg-gradient-to-br from-[#00b963] to-[#006faf] font-heading">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="images/logo_detailed.png"
          className="max-w-sm rounded-lg drop-shadow-lg"
        />
        <div
          className={`${passcode_showing ? 'min-w-full' : 'min-w-min'
            } max-w-[275px] rounded-lg border-2 border-white-500 bg-[rgba(255,255,255,0.2)] p-5 drop-shadow-md`}
        >
          <h1 className="text-2xl font-bold">Welcome to </h1>
          <h1 className="text- text-5xl font-bold">Tournamint</h1>
          <br />
          <p className="min-w-max pt-3 pb-3 text-lg">
            {passcode_showing && db_account_exists
              ? 'Account found. Please enter your 6-digit passcode'
              : null}
            {passcode_showing && !db_account_exists
              ? 'Please create a 6-digit passcode'
              : null}
            {!passcode_showing
              ? 'Please enter your League of Legends® summoner name to get started'
              : null}
          </p>
          {passcode_showing && !db_account_exists
            ? <p className='p-2 border-2 border-orange-400 bg-red-600 rounded-md mb-2 text-white-100'>Please use a passcode that you have not used anywhere else. Data you provide is not encrypted, and is stored in plaintext.</p> : <></>
          }
          <form
            className="flex w-full flex-row justify-between gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              return false
            }}
          >
            <div className="relative flex w-full max-w-md flex-col text-black-600">
              <div
                className={`alert alert-sm alert-warning absolute top-2 left-0 w-full rounded-md shadow-md transition-transform ${show_popup ? 'translate-y-[115%]' : 'translate-y-0'
                  } ${passcode_showing ? 'w-4/5' : 'w-full'}`}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 flex-shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Summoner name doesn't exist</span>
                </div>
              </div>
              <div className="relative">
                {/* IGN input, default showing */}
                <input
                  ref={focusInputRef}
                  autoFocus
                  type="text"
                  placeholder="Start typing..."
                  disabled={passcode_showing ? true : false}
                  className={`input input-bordered input-primary absolute top-0 left-0 w-full transition-all ${passcode_showing ? 'input-disabled w-4/5' : 'w-full '
                    }`}
                  onChange={(e: any) => {
                    setName_input(e.target.value)
                  }}
                />
                {/* Passcode input, default hidden */}
                <input
                  ref={passInputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="([0-9]*[0-9])"
                  placeholder="000000"
                  maxLength={6}
                  className={`w-0/5 input input-secondary absolute top-0 -right-2 animate-none text-center transition-all invalid:bg-red-200 invalid:text-red-800 ${passcode_showing ? 'w-1/5 opacity-100 ' : 'w-0 opacity-0'
                    } ${shake
                      ? 'animate-wiggle border-2 border-red-500'
                      : 'animate-none'
                    }`}
                  onChange={(e: any) => {
                    setPass_input(e.target.value)
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (passcode_showing && db_account_exists) {
                  loginAccount(name_input, pass_input)
                }
                if (passcode_showing && !db_account_exists) {
                  createAccount(name_input, pass_input)
                }
                if (!passcode_showing) {
                  checkName()
                }
              }}
              className="btn glass bg-[#00ff95] text-black-600"
            >
              {passcode_showing && db_account_exists ? 'Log In' : null}
              {passcode_showing && !db_account_exists ? 'Register' : null}
              {!passcode_showing ? 'Get Started' : null}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
