import axios from 'axios'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IRankInfo, IStatistics, ITeam, ITournament } from '../globals/types'

const defaultStatistics = {
  tournaments_played: 5,
  tournaments_won: 2,
  matches_won: 40,
  people_met: 162,
}
export type userContextType = {
  displayName: string
  biography: string
  ign: string
  favouriteChampion: string
  rankInfo: IRankInfo
  statistics: IStatistics
  tournamentsMade: number
  tournaments: ITournament | null
  team: ITeam | null

  setUserDetails?: (
    displayName: string,
    biography: string,
    ign: string,
    favouriteChampion: string,
    rankInfo: IRankInfo,
    statistics: IStatistics,
    tournamentsMade: number,
    tournaments: ITournament | null,
    team: ITeam | null
  ) => void
}

const userContextDefaultValues: userContextType = {
  displayName: 'Default',
  biography: 'A default biography',
  ign: 'DemolitionLuke',
  favouriteChampion: 'Warwick',
  rankInfo: {
    wins: 5,
    losses: 5,
    tier: 'Iron',
    rank: 'II',
  },
  statistics: defaultStatistics,
  tournamentsMade: 0,
  tournaments: {
    tournament_id: 'ABC123',
    tournament_name: 'Default Tournament Name',
    is_private: false,
    organized_by_ign: 'Default',
    type: 16,
    rounds: null,
    date_time_start: 'STRING',
    date_time_end: 'STRING',
    winning_team: null,
    lobby_code: 'ABC123',
    teams: []
  },
  team: {
    team_icon_path: 0,
    team_tag: 'ABC',
    team_colour_hex: '#FF0000',
    team_owner: 'Madlife',
    team_members: ['Madlife', 'Madlife', 'Madlife', 'Madlife', 'Madlife'],
    team_name: 'Amazing Blue Chickens',
    team_statistics: defaultStatistics,
    team_join_key: '12345678',
    tournament_id: 'ABC123'
  },
  setUserDetails: () => { },
}
const UserContext = createContext<userContextType>(userContextDefaultValues)

export function useUser() {
  return useContext(UserContext)
}

type Props = {
  children: ReactNode
}

export function UserProvider({ children }: Props) {
  const [userDetails, updateUserDetails] = useState<userContextType>(
    userContextDefaultValues
  )

  const setUserDetails = (
    name: string,
    bio: string,
    ign: string,
    favouriteChampion: string,
    rankInfo: IRankInfo,
    statistics: IStatistics,
    tournamentsMade: number,
    tournaments: any,
    team: ITeam | null
  ) => {
    updateUserDetails({
      displayName: name,
      biography: bio,
      ign: ign,
      favouriteChampion: favouriteChampion,
      rankInfo: rankInfo,
      statistics: statistics,
      tournamentsMade: tournamentsMade,
      tournaments: tournaments,
      team: team,
    })
    // !DISABLED TUD TO OVERWRITING LOCALSTORAGE
    // if (localStorage?.userDetails != null) {
    //   localStorage.userDetails = JSON.stringify(userDetails)
    //   console.log('USERCONTEXT SET')
    // }
  }

  useEffect(() => {
    if (localStorage?.userDetails != null) {
      const LSuserDetails: any = JSON.parse(
        localStorage.getItem('userDetails') as string
      )

      const displayName: string = LSuserDetails.displayName
      const biography: string = LSuserDetails.biography
      const ign: string = LSuserDetails.ign
      const favouriteChampion: string = LSuserDetails.favouriteChampion
      const rankInfo: IRankInfo = {
        tier: LSuserDetails.tier,
        rank: LSuserDetails.rank,
        wins: LSuserDetails.wins,
        losses: LSuserDetails.losses,
      }
      const statistics: IStatistics = LSuserDetails.statistics
      const tournamentsMade: number = LSuserDetails.tournamentsMade
      const tournaments: any = LSuserDetails.tournaments
      const team: ITeam | null = LSuserDetails.team
      setUserDetails(
        displayName,
        biography,
        ign,
        favouriteChampion,
        rankInfo,
        statistics,
        tournamentsMade,
        tournaments,
        team
      )
      // console.log(userDetails)

      // THIS CODE BLOCK IS ESSENTIAL 💀💀💀
      axios
        .get('/api/userData', {
          params: { ign: ign },
        })
        .then(function (response) {
          // Return promise
          // console.log(response)

          return new Promise((resolve) => {
            resolve('resolved')
          })
        })
        .catch(function (error) {
          console.error(error)
        })
      //
    }
    //  else {
    //   localStorage.setItem(
    //     'userDetails',
    //     JSON.stringify(userContextDefaultValues)
    //   )
    // }

    return
  }, [])

  const value = {
    displayName: userDetails.displayName,
    biography: userDetails.biography,
    ign: userDetails.ign,
    rankInfo: userDetails.rankInfo,
    statistics: userDetails.statistics,
    tournamentsMade: userDetails.tournamentsMade,
    tournaments: userDetails.tournaments,
    team: userDetails.team,
    favouriteChampion: userDetails.favouriteChampion,
    setUserDetails,
  }

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    </>
  )
}
