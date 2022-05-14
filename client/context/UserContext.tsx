import axios from 'axios'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

export type userContextType = {
  displayName: string
  biography: string
  ign: string
  favouriteChampion: string
  rankInfo: Object
  statistics: Object
  tournamentsMade: number
  tournaments: any
  team: any

  setUserDetails?: (
    displayName: string,
    biography: string,
    ign: string,
    favouriteChampion: string,
    rankInfo: Object,
    statistics: Object,
    tournamentsMade: number,
    tournaments: any,
    team: any
  ) => void
}

const userContextDefaultValues: userContextType = {
  displayName: 'Enrique',
  biography: 'A simple biography',
  ign: 'DemolitionLuke',
  favouriteChampion: 'Teemo',
  rankInfo: {},
  statistics: {},
  tournamentsMade: 0,
  tournaments: {},
  team: 'ABC',
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
    rankInfo: Object,
    statistics: Object,
    tournamentsMade: number,
    tournaments: any,
    team: any
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
      const rankInfo: Object = [
        userDetails.tier,
        userDetails.rank,
        userDetails.wins,
        userDetails.losses,
      ]
      const statistics: Object = userDetails.statistics
      const tournamentsMade: number = userDetails.tournamentsMade
      const tournaments: any = userDetails.tournaments
      const team: any = userDetails.team
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
