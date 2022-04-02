// src/context/state.js
import { createContext, useContext } from 'react'

export interface UserDetails {
  username: string
  biography: string
  ign: string
}

const StoreContext = createContext({})

export function StoreContextWrapper({ children }: any) {
  let sharedState: UserDetails = {
    username: 'string',
    biography: 'string',
    ign: 'string',
  }

  return (
    <StoreContext.Provider value={sharedState}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
