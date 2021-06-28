<script>
  import { page } from "$app/stores";
</script>

<nav>
  <div class="item" class:active={$page.path === "/"}>
    <a sveltekit:prefetch href="/">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-home"
        ><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
          points="9 22 9 12 15 12 15 22"
        /></svg
      >Home</a
    >
  </div>
  <div class="item" class:active={$page.path === "/parcels"}>
    <a sveltekit:prefetch href="/parcels">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
      Parcels</a>
  </div>
  <!-- <div class="item" class:active={$page.path === "/camera"}>
    <a sveltekit:prefetch href="/camera">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
      Camera</a>
  </div> -->
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    height: 60px;
    background: #fff;
  }

  .item {
    display: flex;
    flex: 1 1 0;
  }

  svg {
    color: grey;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 1 1 0;
    padding: 5px 0;
    font-size: .7rem;
    color: grey;
    text-decoration: none;
  }

  .active svg, .active a {
    color: var(--primary-color);
  }
</style>
