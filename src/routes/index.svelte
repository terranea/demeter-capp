<script>
  import Item from "$lib/FeedItem.svelte";
  import { onMount, onDestroy } from "svelte";
  import { header } from "$lib/stores";

  import { operationStore, query } from "@urql/svelte";
  const requests = operationStore(`
		query {
			requests(order_by: {created: asc}) {
				id
				reason
				status
				title
        expires
        parcel {
          id
          parcel_id
        }
			}
		}`,
    {},
    { requestPolicy: 'cache-and-network' }
    );

    $: console.log($requests)

    query(requests);
    onMount(async () => {
      header.set({ title: "Request Feed" });
    // supported = "mediaDevices" in navigator;
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  <h1>Recent Requests</h1>

  <div class="feed">
    {#if $requests.fetching}
      <p>loading</p>
    {:else if $requests.error}
      <p>Oh no... {$requests.error.message}</p>
    {:else}
      {#each $requests.data.requests as r}
        <Item
          id={r.id}
          title={r.title}
          reason={r.reason}
          parcel={r.parcel.parcel_id}
          status={r.status}
          expires={r.expires}
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
    width: 100%;
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
