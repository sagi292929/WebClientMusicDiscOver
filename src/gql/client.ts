
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export class ServerConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServerConnectionError'
  }
}

export function createApolloClient(
  onConnectionChange: (reachable: boolean) => void,
  timeoutMs = 8000,
) {
  const trackedFetch: typeof fetch = async (input, init) => {
    const controller = new AbortController()
    let timedOut = false
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)
    const callerSignal = init?.signal
    const abortFromCaller = () => controller.abort(callerSignal?.reason)

    if (callerSignal?.aborted) {
      abortFromCaller()
    } else {
      callerSignal?.addEventListener('abort', abortFromCaller, { once: true })
    }

    try {
      const response = await fetch(input, { ...init, signal: controller.signal })
      onConnectionChange(true)
      return response
    } catch (error) {
      if (controller.signal.aborted && !timedOut) {
        throw error
      }

      const isOnline = typeof navigator === 'undefined' || navigator.onLine
      onConnectionChange(false)
      throw new ServerConnectionError(
        timedOut
          ? 'The server took too long to respond.'
          : isOnline
          ? 'Cannot connect to the server right now.'
          : 'You appear to be offline.',
      )
    } finally {
      window.clearTimeout(timeoutId)
      callerSignal?.removeEventListener('abort', abortFromCaller)
    }
  }

  return new ApolloClient({
    link: new HttpLink({
      uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
      fetch: trackedFetch,
    }),
    cache: new InMemoryCache(),
  })
}
