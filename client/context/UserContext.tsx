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
  setUserDetails?: (displayName: string, biography: string, ign: string) => void
}

const userContextDefaultValues: userContextType = {
  displayName: '[Default]',
  biography: '[Default]',
  ign: '[Default]',
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

  const setUserDetails = (name: string, bio: string, ign: string) => {
    updateUserDetails({
      displayName: name,
      biography: bio,
      ign: ign,
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
      setUserDetails(displayName, biography, ign)

      axios
        .get('http://localhost:4000/userData', {
          params: { ign: ign },
        })
        .then(function (response) {
          console.log('Context Data: ', displayName, biography, ign)

          // Return promise
          return new Promise((resolve) => {
            resolve('resolved')
          })
        })
        .catch(function (error) {
          console.error(error)
        })

      // !IMPORTANT, REMOVE THIS ONCE ACCOUNT LOGIC IS SET UP. THIS SEEDS LOCAL STORAGE WITH A DEFAULT SET OF USER DETAILS
    } else {
      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          displayName: 'June',
          bio: 'Bio',
          ign: 'June',
        })
      )
    }

    return
  }, [])

  const value = {
    displayName: userDetails.displayName,
    biography: userDetails.biography,
    ign: userDetails.ign,
    setUserDetails,
  }

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>
    </>
  )
}
