import axios from 'axios'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IRankInfo, IStatistics, ITeam } from '../globals/types'

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
  tournaments: any
  team: ITeam

  setUserDetails?: (
    displayName: string,
    biography: string,
    ign: string,
    favouriteChampion: string,
    rankInfo: IRankInfo,
    statistics: IStatistics,
    tournamentsMade: number,
    tournaments: any,
    team: ITeam
  ) => void
}

const userContextDefaultValues: userContextType = {
  displayName: 'Luke',
  biography: 'A simple biography',
  ign: 'DemolitionLuke',
  favouriteChampion: 'Vi',
  rankInfo: {
    wins: 5,
    losses: 5,
    tier: 'Iron',
    rank: 'II',
  },
  statistics: defaultStatistics,
  tournamentsMade: 0,
  tournaments: {},
  team: {
    team_tag: 'ABC',
    team_owner: 'Luke',
    team_members: ['Luke'],
    team_name: 'Amazing Blue Chickens',
    team_statistics: defaultStatistics,
  },
  setUserDetails: () => {},
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
    team: ITeam
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
  }

  useEffect(() => {
    if (localStorage?.userDetails != null) {
      const userDetails: any = JSON.parse(
        localStorage.getItem('userDetails') as string
      )
      const displayName: any = userDetails.displayName
      const biography: any = userDetails.biography
      const ign: string = userDetails.ign
      const favouriteChampion: string = userDetails.favouriteChampion
      const rankInfo: IRankInfo = {
        tier: userDetails.tier,
        rank: userDetails.rank,
        wins: userDetails.wins,
        losses: userDetails.losses,
      }
      const statistics: IStatistics = userDetails.statistics
      const tournamentsMade: number = userDetails.tournamentsMade
      const tournaments: any = userDetails.tournaments
      const team: ITeam = userDetails.team
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

      // THIS CODE BLOCK IS ESSENTIAL 💀💀💀
      axios
        .get('/api/userData', {
          params: { ign: ign },
        })
        .then(function (response) {
          // Return promise
          console.log(response)

          return new Promise((resolve) => {
            resolve('resolved')
          })
        })
        .catch(function (error) {
          console.error(error)
        })
      //

      // !IMPORTANT, REMOVE THIS ONCE ACCOUNT LOGIC IS SET UP. THIS SEEDS LOCAL STORAGE WITH A DEFAULT SET OF USER DETAILS
    } else {
      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          ign: 'DemolitionLuke',
          displayName: 'Luke',
          bio: 'Vi stands for violence.',
          favouriteChampion: 'Vi',
          tournamentsMade: 5,
          tournaments: '[DEFAULTVALUE]',
          team: 'ABC',
          rankInfo: { tier: 'Iron', rank: 'IV', wins: '5', losses: '500' },
          statistics: {
            tournaments_played: 5,
            tournaments_won: 2,
            matches_won: 6,
            people_met: 40,
          },
        })
      )
    }

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
