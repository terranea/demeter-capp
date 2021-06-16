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
  import { operationStore, query } from "@urql/svelte";
  export let id;
  const request = operationStore(
    `
      query MyQuery($id: uuid!) {
      requests_by_pk(id: $id) {
        id
        due_date
        description
        created
        kind
        parcel_id
        reason
        status
        title
        user_id
      }
    }`,
    {id},
    { requestPolicy: "cache-and-network" }
  );
  query(request);

</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<h1>Request</h1>

<section>
  <h1>Recent Activity</h1>

  {#if $request.fetching}
    <p>loading</p>
  {:else if $request.error}
    <p>Oh no... {$request.error.message}</p>
  {:else}
    <h2>{$request.data.requests_by_pk.id}</h2>
  {/if}
</section>
