import React, { useEffect } from 'react'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'
import { IAccountData, ISettings } from '../globals/types'

export interface Props {
  userData: any
  refreshUserInfo: Function
}

function Settings(props: Props) {
  const { refreshUserInfo = null, ...restProps } = props

  // User Details Properties
  const {
    displayName,
    biography,
    ign,
    favouriteChampion,
    setUserDetails,
    rankInfo,
    statistics,
    team,
    tournaments,
    tournamentsMade,
    settings
  } = useUser()


  var temp_settings: any = settings
  useEffect(() => {
    temp_settings = settings
    console.log('Current settings:', temp_settings);

  }, [])

  const handleSettingChange = (setting: string, checked: boolean) => {
    if (!temp_settings) { return }
    temp_settings[setting] = checked

    saveUserDetails(temp_settings)

    if (refreshUserInfo !== null) {
      refreshUserInfo()
    }
    console.log('SETTINGS SAVED')
  }

  const saveUserDetails = async (settings: ISettings) => {

    if (setUserDetails == null) { return }
    if (localStorage == null) { return }
    if (localStorage.userDetails == null) { return }
    console.log('New settings:', settings);


    setUserDetails(
      displayName,
      biography,
      ign,
      favouriteChampion,
      rankInfo,
      statistics,
      tournamentsMade,
      tournaments,
      team,
      settings
    )
    localStorage.setItem(
      'userDetails',
      JSON.stringify({
        displayName: displayName,
        biography: biography,
        ign: ign,
        favouriteChampion: favouriteChampion,
        rankInfo: {
          tier: rankInfo.tier,
          rank: rankInfo.rank,
          wins: rankInfo.wins,
          losses: rankInfo.losses,
        },
        statistics: statistics,
        tournamentsMade: tournamentsMade,
        tournaments: tournaments,
        team: team,
        settings: settings
      })
    )

    // Redis
    let get_data: any = null
    const account_api_url =
      '/api/account?' + new URLSearchParams({ ign: ign })
    const account_get_response = await fetch(account_api_url)
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status != 'Account does not yet exist') {
          get_data = res
        }
      })
      .catch((res) => console.log(res.error))

    try {
      const dataOut: IAccountData = {
        ign: ign,
        username: displayName,
        bio: biography,
        favourite_champion: favouriteChampion,
        passcode: get_data.passcode,
        team_tag: get_data.team_tag,
        tournament_id: get_data.tournament_id,
        settings: settings
      }
      // console.log('data_out', dataOut)

      const account_post_response = await fetch('/api/account', {
        body: JSON.stringify({ data: dataOut }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div
      id="wrapper"
      className="container mx-auto h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <article className="prose prose-slate mx-auto flex h-full flex-col justify-between text-black-700 dark:text-white-200">
        {/* Settings */}
        <div>
          <h1 className="text-black-700 dark:text-white-200">Settings</h1>
          <div className="align-center flex flex-row items-center justify-between">
            <label>Center the navbar</label>
            <input type="checkbox" className="toggle" defaultChecked={temp_settings?.centered_navbar} onChange={(e: any) => {
              handleSettingChange('centered_navbar', e.target.checked)
            }} />
          </div>
        </div>

        {/* Footer */}
        <div className="">
          <div className="divider dark:before:bg-white-800 dark:after:bg-white-800"></div>
          <div className="align-center flex flex-row items-center justify-between ">
            <label>Delete Account</label>
            <Button
              text="DELETE"
              type="negative"
              fixedWidth
              onClick={() => alert('TODO: impl account deletion')}
            ></Button>
          </div>
          <ul>
            <li className="text-gray-500 dark:text-gray-400">
              Deleting your account removes all identifiable user data
              associated with you from this Tournamint distribution.
            </li>
          </ul>
        </div>
      </article>
    </div>
  )
}

export default Settings
