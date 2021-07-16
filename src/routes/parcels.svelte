<script>
  import { operationStore, query } from "@urql/svelte";
  import { header } from '$lib/stores';
  import { onMount } from "svelte";
  import maplibregl from "maplibre-gl";
  import bbox from "@turf/bbox";

  let map;
  let selParcel;

  const parcels = operationStore(
    `
		query {
			parcels(order_by: {created: asc}) {
				id
				name
				description
				created
				area
				geom
        crop_type
        lpis_id
        parcel_id
  		}
		}`,
    {},
    { requestPolicy: "cache-and-network" }
  );

  query(parcels);

  let colors = [
    "#ffffcc",
    "#a1dab4",
    "#41b6c4",
    "#2c7fb8",
    "#253494",
    "#fed976",
    "#feb24c",
    "#fd8d3c",
    "#f03b20",
    "#bd0026",
  ];

  $: fc = $parcels.fetching
    ? { type: "FeatureCollection", features: [] }
    : {
        type: "FeatureCollection",
        features: $parcels.data.parcels.map((p, i) => {
          return {
            type: "Feature",
            properties: { color: colors[i > 9 ? 0 : i] },
            geometry: p.geom,
          };
        }),
      };

  $: if (map && map.getSource("parcels")) {
    map.getSource("parcels").setData(fc);
  }

  onMount(async () => {
    header.set({"title": "Your Parcels"})

    map = new maplibregl.Map({
      container: "map", // container id
      style:
        "https://api.maptiler.com/maps/hybrid/style.json?key=Ln1qLDqR5RvwLteNdPJ0", // style URL
      center: [13, 48], // starting position [lng, lat]
      zoom: 8, // starting zoom
      dragRotate: false,
    });
    map.on("load", function () {
      map.addSource("parcels", {
        type: "geojson",
        data: fc,
      });
      map.addLayer({
        id: "parcels",
        type: "line",
        source: "parcels",
        layout: {},
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
        },
      });
      if (fc.features.length > 0) {
        map.fitBounds(bbox(fc), {
          padding: { top: 10, bottom: 25, left: 15, right: 5 },
        });
      }
    });
  });

  function jump(g, id) {
    selParcel = id
    map.fitBounds(bbox(g), {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
  }

  function date(d) {
    var myDate = new Date(d);
    const format = { year: "numeric", month: "short", day: "numeric" };
    return myDate.toLocaleDateString("en-EN", format);
  }
</script>

<svelte:head>
  <title>Parcels</title>
  <link
    href="https://unpkg.com/maplibre-gl@1.14.0-rc.1/dist/maplibre-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<div id="map" />
<section>
  <div class="parcels">
    {#if $parcels.fetching}
      <p>loading</p>
    {:else if $parcels.error}
      <p>Oh no... {$parcels.error.message}</p>
    {:else}
      {#each $parcels.data.parcels as p}
        <div class="parcel" on:click={jump(p.geom, p.id)} class:selected={selParcel === p.id}>
          <h2>{p.name}</h2>
          <p></p>
          <p><strong>ID:</strong> {p.parcel_id}</p>
          <p><strong>Created:</strong> {date(p.created)}</p>
          <p><strong>Crop Type:</strong> {p.crop_type}</p>
          <p><strong>Area:</strong> {p.area}m²</p>
          <p style="grid-column: span 2; display: inline;"><strong>LPIS:</strong> {p.lpis_id}</p>
        </div>
      {/each}
    {/if}
  </div>
</section>

<style>
  #map {
    height: 200px;
    min-height: 200px;
    width: 100%;
    margin-bottom: 1rem;
  }

  section {
    flex: 1;
    overflow-y: auto;
    width: 100%;
  }

  .parcel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 35px 20px 20px 20px;
    column-gap: 1rem;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
  }

  h2 {
    color: #4ac2c1;
    margin: 0;
  }

  .parcel p {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
  }

  .parcels {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: .7rem;
  }

  .selected {
    background-color: var(--secondary-color);
  }

  @media (min-width: 560px) {
    #map {
      height: 50%;
      min-height: 200px;
      width: 100%;
    }

  .parcels {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  }
</style>
