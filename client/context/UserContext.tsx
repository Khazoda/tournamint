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
  setUserDetails?: (
    displayName: string,
    biography: string,
    ign: string,
    favouriteChampion: string,
    rankInfo: Object
  ) => void
}

const userContextDefaultValues: userContextType = {
  displayName: 'Enrique',
  biography: 'A simple biography',
  ign: 'DemolitionLuke',
  favouriteChampion: 'Teemo',
  rankInfo: {},
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
    rankInfo: Object
  ) => {
    updateUserDetails({
      displayName: name,
      biography: bio,
      ign: ign,
      favouriteChampion: favouriteChampion,
      rankInfo: rankInfo,
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
      setUserDetails(displayName, biography, ign, favouriteChampion, rankInfo)

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
          displayName: 'Enrique',
          bio: "A term to describe a situation where one sneaks into the enemy's base and quickly destroys it.",
          ign: 'Xpeke',
          favouriteChampion: 'Teemo',
          rankInfo: { tier: 'Iron', rank: 'IV', wins: '5', losses: '500' },
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
    favouriteChampion: userDetails.favouriteChampion,
    setUserDetails,
  }

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    </>
  )
}
