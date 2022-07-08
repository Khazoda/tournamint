import axios from 'axios'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Props, useEffect, useRef, useState } from 'react'
import { useUser } from '../context/UserContext'
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
      tournaments_played: 0,
      tournaments_won: 0,
      matches_won: 0,
      people_met: 0,
    },
    tournamentsMade: 0,
    tournaments: null,
    team: null,
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
        console.log(res)
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
        } catch (error) {}
      })
      .catch((res) => console.log('Error:', res.error))

    if (valid_lol_name) {
      // Does account exist already?
      const account_api_url =
        '/api/account?' + new URLSearchParams({ ign: name_input })
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
      ign: ign,
      username: ign,
      bio: 'Default Biography',
      favourite_champion: 'Aatrox',
      passcode: pass,
    }
    const account_post_response = await fetch('/api/account', {
      body: JSON.stringify({ data: dataOut }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (account_post_response.status == 200) {
      setAccount_data({ dataOut })
      console.log(account_post_response)

      populateUserData(dataOut)
      window.location.href = '/profile'
    }
  }

  async function loginAccount(ign: string, pass: string) {
    const url = '/api/account?' + new URLSearchParams({ ign: name_input })

    // Check if name entered exists on Riot's EUW servers
    await fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('HTTP status ' + res.status)
        }
        return res.json()
      })
      .then((res) => {
        try {
          if (res.status == 400) {
            // Invalid name popup
            console.error('Invalid name entered')
          } else {
            if (pass_input == res.passcode) {
              console.log(pass_input, res)

              setAccount_data(res)
              populateUserData(res)
              window.location.href = '/main'
            } else {
              setShake(true)
              setTimeout(() => {
                setShake(false)
              }, 1500)
            }
          }
        } catch (error) {}
      })
      .catch((res) => console.log('Error:', res.error))
  }

  const populateUserData = (account_data: any) => {
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
    <div className="hero absolute z-50 h-full min-h-screen w-full bg-base-200 bg-gradient-to-br from-[#00b963] to-[#006faf] font-heading">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="images/logo_detailed.png"
          className="max-w-sm rounded-lg drop-shadow-lg"
        />
        <div
          className={`${
            passcode_showing ? 'min-w-full' : 'min-w-min'
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

          <form
            className="flex w-full flex-row justify-between gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              return false
            }}
          >
            <div className="relative flex w-full max-w-md flex-col text-black-600">
              <div
                className={`alert alert-sm alert-warning absolute top-2 left-0 w-full rounded-md shadow-md transition-transform ${
                  show_popup ? 'translate-y-[115%]' : 'translate-y-0'
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
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
                  className={`input input-bordered input-primary absolute top-0 left-0 w-full transition-all ${
                    passcode_showing ? 'input-disabled w-4/5' : 'w-full '
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
                  className={`w-0/5 input input-secondary absolute top-0 -right-2 animate-none text-center transition-all invalid:bg-red-200 invalid:text-red-800 ${
                    passcode_showing ? 'w-1/5 opacity-100 ' : 'w-0 opacity-0'
                  } ${
                    shake
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
