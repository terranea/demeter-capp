import {writable} from 'svelte/store';

export const requests = writable([])

const fetchRequests = async () => {
  console.log("FETCH REQUESTS")
  const url = "http://192.168.178.21:8082/api/rest/requests";
  const res = await fetch(url);
  const data = await res.json();
  requests.set(data.requests)
}

fetchRequests();

import { operationStore, query } from '@urql/svelte';

const todos = operationStore(`
  query {
    todos {
      id
      title
    }
  }
`);

query(todos);