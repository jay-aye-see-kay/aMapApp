import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'

let apolloClient: ApolloClient<any> | null = null

const create = <InitialState extends any>(initialState: InitialState) => {
  const isBrowser = typeof window !== 'undefined'

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: 'http://localhost:8080/v1/graphql', // Server URL (must be absolute)
      credentials: 'same-origin',              // Additional fetch() options like `credentials` or `headers`
      fetch: !isBrowser ? fetch : undefined,   // Use fetch() polyfill on the server
    }),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export const initApollo = <InitialState extends any>(initialState?: InitialState) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}

