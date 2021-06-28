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
  import Task from "$lib/Tasks/task.svelte"
  export let id;
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
  $: console.log($request)
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  
  {#if $request.fetching}
  <p>loading</p>
  {:else if $request.error}
  <p>Oh no... {$request.error.message}</p>
  {:else}
    <h1>{$request.data.requests_by_pk.title}</h1>

    <h3>Parcel:</h3>
    <h2>{$request.data.requests_by_pk.parcel.name}</h2>

    <h3>Reason</h3>
    <p>{$request.data.requests_by_pk.reason}</p>

    <div class="tasks">
      <h1>Tasks:</h1>
      {#each $request.data.requests_by_pk.photo_request_tasks as t, i}
        <Task data={t} index={i+1} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .box {
    background-color: #fccfba;
    padding: 1rem 0.5rem;
    margin-top: 1rem;
    border-radius: 8px;
  }

  .box h3 {
    margin: 0;
    color: #000;
  }

  h2 {
    margin: 0;
  }

  h3 {
    margin-top: 1.2rem;
    margin-bottom: 0.2rem;
  }
</style>
