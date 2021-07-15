<script>
  import { goto } from "$app/navigation";
  import { auth } from "$lib/auth";
	import { header } from '$lib/stores';

  export let loggedIn = false;

  function logout() {
    goto("/")
    auth.logout()
  }
</script>

<header>
  <div class="logo">
    <img src="/DemeterLogo.png" alt="" />
  </div>
  <div class="welcome">
    <h2>{$header.title}</h2>
  </div>
  <div class="settings">
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-menu"
      ><line x1="3" y1="12" x2="21" y2="12" /><line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
      /><line x1="3" y1="18" x2="21" y2="18" /></svg
    > -->
    {#if loggedIn}
    <button on:click="{logout}">Logout</button>
    {/if}
  </div>
</header>

<style>
  header {
    display: flex;
    background: var(--primary-color);
    align-items: center;
    padding: 0 1rem;
    height: 50px;
  }

  header > div {
    flex: 1 1 0px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  button {
    margin: 0;
    display: inline-block;
    outline: 0;
    border: none;
    cursor: pointer;
    font-weight: 300;
    border-radius: 4px;
    font-size: 13px;
    min-height: 30px;
    background-color: #0000000d;
    color: #0e0e10;
    padding: 0 1rem;
  }

  button:hover {
    background-color: #0000001a;
  }

  h2 {
    text-align: center;
    color: #fff;
		width: 100%;
  }

  img {
    height: 15px;
    flex: 0;
  }

  .settings {
    text-align: right;
    justify-content: flex-end;
  }

  svg {
		color: #fff;
  }

  @media (min-width: 480px) {
    img {
      height: 30px;
    }
  }
</style>
