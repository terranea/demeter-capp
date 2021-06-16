<script context="module">
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
		}`,
		{},
    { requestPolicy: 'cache-and-network' }
		);

  query(parcels);
  $: console.log(parcels);
</script>

<svelte:head>
  <title>Parcels</title>
</svelte:head>

<section>
  <h1>Your Parcels</h1>

  <div class="feed">
    {#if $parcels.fetching}
      <p>loading</p>
    {:else if $parcels.error}
      <p>Oh no... {$parcels.error.message}</p>
    {:else}
      {#each $parcels.data.parcels as p}
				<h2>{p.name}</h2>
      {/each}
    {/if}
  </div>
</section>