import { createContext, ReactNode, useContext, useState } from 'react'

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
    console.log(userDetails)
  }

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
