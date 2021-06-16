<script context="module">
</script>

<script>
  import Item from "$lib/Feed/Item.svelte";

  import { operationStore, query } from "@urql/svelte";
  const requests = operationStore(`
		query {
			requests {
				id
				kind
				reason
				status
				title
				parcel_id
			}
		}`,
    {},
    { requestPolicy: 'cache-and-network' }
    );

  query(requests);
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <h1>Recent Activity</h1>

  <div class="feed">
    {#if $requests.fetching}
      <p>loading</p>
    {:else if $requests.error}
      <p>Oh no... {$requests.error.message}</p>
    {:else}
      {#each $requests.data.requests as r}
        <Item
          id={r.id}
          kind={r.kind}
          description={r.reason}
          parcel={r.parcel_id}
        />
      {/each}
    {/if}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  h1 {
    width: 100%;
  }

  .feed {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
