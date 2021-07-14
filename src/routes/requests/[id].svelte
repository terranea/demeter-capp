<script context="module">
  export async function load({ page }) {
    return {
      props: {
        id: page.params.id,
      },
    };
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte";
  import { operationStore, query } from "@urql/svelte";
  import { header } from "$lib/stores";
  import Task from "$lib/Task.svelte";
  import maplibregl from "maplibre-gl";
  import bbox from "@turf/bbox";
  export let id;
  let map;
  let locationWatcher;
  let locationError;
  let userLocation = {
    type: "Point",
    coordinates: [],
  };

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

  $: if (!$request.fetching) {
    console.log("BASLDFAJD");
    if (map && map.getSource("tasklocations")) {
      const data = taskLocs();

      console.log(data);
      map.getSource("tasklocations").setData(data);
    }
  }

  function taskLocs() {
    if ($request.fetching) return undefined;
    let features = [];
    $request.data.requests_by_pk.photo_request_tasks.forEach((e) => {
      const f = {
        type: "Feature",
        properties: {},
        geometry: e.location,
      };
      features.push(f);
    });
    let fc = {
      type: "FeatureCollection",
      features: features,
    };
    console.log(fc);

    map.getSource("tasklocations").setData(fc);
  }

  // $: if (!$request.fetching && map) {
  //   let ctr = $request.data.requests_by_pk.parcel.geom;
  //   map.fitBounds(bbox(ctr), {
  //     padding: { top: 40, bottom: 40, left: 20, right: 20 },
  //   });
  //   // map.jumpTo({ center: ctr, zoom: 14});
  // }

  $: if (!$request.fetching && map && map.getSource("userlocation")) {
    map.getSource("userlocation").setData(userLocation);
  }

  $: console.log(parcel);
  onMount(async () => {
    header.set({ title: "Request" });

    map = new maplibregl.Map({
      container: "map", // container id
      style:
        "https://api.maptiler.com/maps/hybrid/style.json?key=Ln1qLDqR5RvwLteNdPJ0", // style URL
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

      map.addSource("tasklocations", {
        type: "geojson",
        data: {
          type: "Point",
          coordinates: [],
        },
      });

      map.addLayer({
        id: "parcel",
        type: "line",
        source: "parcel",
        layout: {},
        paint: {
          "line-color": "#fed976",
          "line-width": 3,
        },
      });

      map.addLayer({
        id: "userlocation",
        source: "userlocation",
        type: "circle",
        paint: {
          "circle-radius": 5,
          "circle-color": "#007cbf",
        },
      });

      map.addLayer({
        id: "tasklocations",
        source: "tasklocations",
        type: "circle",
        paint: {
          "circle-radius": 5,
          "circle-color": "#ff0000",
        },
      });
      taskLocs();
    });
    getLocation();
  });

  onDestroy(async () => {
    if (locationWatcher) navigator.geolocation.clearWatch(locationWatcher);
  });

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
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        };
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
  <link
    href="https://unpkg.com/maplibre-gl@1.14.0-rc.1/dist/maplibre-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<div id="map" />

<section>
  {#if !$request.fetching}
    <h2>Tasks for {$request.data.requests_by_pk.parcel.name}</h2>
    <div class="tasks">
      {#each $request.data.requests_by_pk.photo_request_tasks as t, i}
        <Task
          task={t}
          index={i + 1}
          parcel={$request.data.requests_by_pk.parcel_id}
        />
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

  section {
    margin-top: .8rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    width: 100%;
  }

  .tasks {
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  section h1 {
    margin-bottom: 0.4rem;
  }

  #map {
    height: 200px;
    min-height: 200px;
    width: 100%;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin: 0;
    margin-bottom: .4rem;
  }
</style>
