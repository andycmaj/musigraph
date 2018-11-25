import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from 'apollo-boost';
import { withClientState } from 'apollo-link-state';
import fetch from 'isomorphic-unfetch';
import selectOriginNode from './selectOriginNode';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState) {
  const cache = new InMemoryCache().restore(initialState || {});
  const clientStateLink = withClientState({
    cache,
    defaults: {
      originNode: {
        __typename: 'Artist',
        name: 'John Scofield',
        id: 12628,
      },
    },
    resolvers: {
      Mutation: {
        selectOriginNode,
      },
    },
  });
  const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql', // Server URL (must be absolute)
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([clientStateLink, httpLink]),
    cache,
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
