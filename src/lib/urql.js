import { auth } from "$lib/auth"
import { createClient, defaultExchanges, subscriptionExchange } from '@urql/svelte';

const getToken = (auth) => {
  if (auth) {
    if (auth.isAuthenticated()) {
      return auth.getJWTToken()
    }
  }
  
  return null;
};

const client = createClient({
  url: 'https://capp.terranea.de/v1/graphql',
  fetchOptions: () => {
    const token = getToken(auth);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

export {client}


