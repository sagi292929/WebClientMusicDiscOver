import { createContext, useContext } from 'react'

export type ConnectionContextValue = {
  isOnline: boolean
  isServerReachable: boolean | null
  isConnected: boolean
}

export const ConnectionContext = createContext<ConnectionContextValue | null>(null)

export function useConnection() {
  const connection = useContext(ConnectionContext)
  if (!connection) {
    throw new Error('useConnection must be used within a ConnectionProvider.')
  }
  return connection
}
