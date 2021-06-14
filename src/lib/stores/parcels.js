import {writable} from 'svelte/store';

export const parcels = writable([])

const fetchParcels = async () => {
  const url = "http://localhost:8082/api/rest/parcels";
  const res = await fetch(url);
  const data = await res.json();
  requests.set(data.parcels)
}

fetchParcels();