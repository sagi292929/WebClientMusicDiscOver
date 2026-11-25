import { ApolloProvider } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { createApolloClient, ServerConnectionError } from '../gql/client'
import { ServerErrorView } from '../components/errors/ServerErrorView'
import { ConnectionContext } from './connection'

const connectionCheckQuery = gql`
  query ConnectionCheck {
    __typename
  }
`

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  const [isServerReachable, setIsServerReachable] = useState<boolean | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryError, setRetryError] = useState<string | null>(null)
  const client = useMemo(
    () => createApolloClient(setIsServerReachable),
    [setIsServerReachable],
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const retry = useCallback(async () => {
    if (isRetrying) return

    setIsRetrying(true)
    setRetryError(null)
    try {
      await client.query({
        query: connectionCheckQuery,
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      })
      await Promise.allSettled([
        client.refetchQueries({ include: 'active' }),
      ])
    } catch (error) {
      if (!(error instanceof ServerConnectionError)) {
        setRetryError(error instanceof Error ? error.message : 'Retry failed.')
      }
    } finally {
      setIsRetrying(false)
    }
  }, [client, isRetrying])

  const value = useMemo(
    () => ({
      isOnline,
      isServerReachable,
      isConnected: isOnline && isServerReachable !== false,
    }),
    [isOnline, isServerReachable],
  )

  return (
    <ConnectionContext.Provider value={value}>
      <ApolloProvider client={client}>
        <div hidden={!value.isConnected}>{children}</div>
        {!value.isConnected && (
          <ServerErrorView
            isOffline={!isOnline}
            isRetrying={isRetrying}
            retryError={retryError}
            onRetry={() => void retry()}
          />
        )}
      </ApolloProvider>
    </ConnectionContext.Provider>
  )
}
