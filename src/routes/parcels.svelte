<script context="module">
  export const prerender = true;
</script>

<script>
  import { operationStore, query } from "@urql/svelte";

  const parcels = operationStore(`
		query {
			parcels {
				id
				name
				description
				created
				area
				geog
  		}
		}
	`);

  query(parcels);
  $: console.log(parcels);
</script>

<svelte:head>
  <title>Parcels</title>
</svelte:head>
