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
  url: 'http://192.168.178.21:8080/v1/graphql',
  fetchOptions: () => {
    const token = getToken(auth);
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

export {client}


