<script context="module">
  export async function load({ page, fetch, session, context }) {
    return {
      props: {
        id: page.params.id,
      },
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { operationStore, query } from "@urql/svelte";
  import Task from "$lib/Tasks/task.svelte";
  import maplibregl from "maplibre-gl";
  export let id;
  let map;
  let locationWatcher;
  let locationError;
  let userLocation = {
        "type": "Point",
        "coordinates": []
      }

  let coordinates;
  const request = operationStore(
    `
    query SingleRequest($id: uuid!) {
      requests_by_pk(id: $id) {
        id
        expires
        description
        created
        parcel_id
        reason
        status
        title
        parcel {
          id
          name
          geom
        }
        photo_request_tasks {
          id
          location
          heading
          description
          created
          comment
        }
      }
    }
    `,
    { id },
    { requestPolicy: "cache-and-network" }
  );
  query(request);

  $: parcel = !$request.fetching
    ? $request.data.requests_by_pk.parcel.geom
    : {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
      };

  $: if (!$request.fetching && map) {
    let ctr = $request.data.requests_by_pk.parcel.geom.coordinates[0][0];
    map.jumpTo({ center: ctr, zoom: 5 });
  }

  $: if (!$request.fetching && map && map.getSource("userlocation")) {
    map.getSource("userlocation").setData(userLocation)
  }


  $: console.log(parcel);
  onMount(async () => {
    map = new maplibregl.Map({
      container: "map", // container id
      style: "https://demotiles.maplibre.org/style.json", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
      dragRotate: false,
    });
    map.on("load", function () {
      map.addSource("parcel", {
        type: "geojson",
        data: parcel,
      });

      map.addSource("userlocation", {
        type: "geojson",
        data: userLocation,
      });

      map.addLayer({
        id: "parcel",
        type: "fill",
        source: "parcel",
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.8,
        },
      });

      map.addLayer({
      'id': 'userlocation',
      'source': 'userlocation',
      'type': 'circle',
      'paint': {
      'circle-radius': 5,
      'circle-color': '#007cbf'
      }
      });
    });
    getLocation();
    return () => {
      if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
    };
  });

  $: console.log($request);

  function setParcel() {
    if (map && map.getSource("parcel")) {
      console.log("SET DATA");
      map.getSource("parcel").setData($request.data.requests_by_pk.parcel.geom);
      let ctr = $request.data.requests_by_pk.parcel.geom.coordinates[0][0];
      map.jumpTo({ center: ctr, zoom: 11 });
    }
  }

  function getLocation() {
    if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
    if (navigator.geolocation) {
      const onSuccess = (position) => {
        locationError = null;
        console.log(position);
        coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
        };
        userLocation = {
        "type": "Point",
        "coordinates": [
          position.coords.longitude,
          position.coords.latitude
        ]
      }
      };
      const onError = (error) => {
        switch (error.code) {
          case 0:
            locationError = "Geolocation Error: unknown error";
            break;
          case 1:
            locationError = "Geolocation Error: permission denied";
            break;
          case 2:
            locationError = "Geolocation Error: position unavailable";
            break;
          case 3:
            locationError = "Geolocation Error: timed out";
            break;
        }
      };
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      locationWatcher = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <div class="header">
    {#if $request.fetching}
      <p>loading</p>
    {:else if $request.error}
      <p>Oh no... {$request.error.message}</p>
    {:else}
      <h1>{$request.data.requests_by_pk.title}</h1>
      <h2>for {$request.data.requests_by_pk.parcel.name}</h2>
    {/if}
  </div>

  <div id="map" />

  {#if !$request.fetching}
    <div class="tasks">
      <h1>Tasks:</h1>
      {#each $request.data.requests_by_pk.photo_request_tasks as t, i}
        <Task data={t} index={i + 1} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 1rem;
  }

  .tasks{
    margin-top: 1.4rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  #map {
    height: 200px;
    width: 100%;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin: 0;
  }

  h3 {
    margin-bottom: 0.2rem;
  }
</style>
