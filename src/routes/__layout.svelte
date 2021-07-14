<script>
  import Header from "$lib/Header.svelte";
  import Nav from "$lib/Nav.svelte";
  import "../app.css";
  import { onMount } from "svelte";
  import { auth } from "$lib/auth";
  import { goto } from "$app/navigation";
  import Login from "$lib/Login.svelte";
  import { client } from "$lib/urql";
  import { setClient } from "@urql/svelte";

  let isLoading = true;
  let isAuthenticated = false;
  
  setClient(client)
  onMount(async () => {
    const isa = await auth.isAuthenticatedAsync();
    isLoading = false;
    isa ? (isAuthenticated = true) : (isAuthenticated = false);

    auth.onAuthStateChanged((loggedIn) => {
      if (loggedIn) {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
        goto("/");
      }
    });

  });
</script>

<Header />

<main>
  {#if isLoading}
    <p>loading</p>
  {:else if isAuthenticated}
    <slot />
  {:else}
    <Login />
  {/if}
</main>

<Nav />

<!-- <footer>
	<a href="/about">About</a>
</footer> -->
<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
    overflow-y: auto;
    align-items: center;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
