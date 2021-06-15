import { auth } from "$lib/auth"
import { createClient, dedupExchange, cacheExchange, fetchExchange, ssrExchange } from '@urql/svelte';

const getToken = (auth) => {
  if (auth) {
    if (auth.isAuthenticated()) {
      return auth.getJWTToken()
    }
  }

  return null;
};

console.log("CREATE GRAPHCLIENT")

const isServerSide = typeof window === 'undefined';

// The `ssrExchange` must be initialized with `isClient` and `initialState`
const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? window.__URQL_DATA__ : undefined,
});

const client = createClient({
  url: 'http://localhost:8080/v1/graphql',
  fetchOptions: () => {
    const token = getToken(auth);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

export {client}


