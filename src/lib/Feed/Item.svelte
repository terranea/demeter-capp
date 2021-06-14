<script>
  export let kind = "photo";
  export let description =
    "We request further information for the land parcel #1010. Please tap to get further instructions.";
  export let reason = "";
  export let parcel = "";
  export let id;

  $: title = kind == "photo" ? "Image Request" : "Request";
</script>

<div class="item">
  <a href={`/requests/${id}`}>
    <h2>{title}</h2>
    <p>{description}</p>
    <div class="parcel">Parcel: {parcel}</div>
  </a>
</div>

<style>
  .item {
    min-height: 100px;
    width: 100%;
    background: #fff;
    border: 1px solid var(--primary-color);
    border-radius: 5px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .parcel {
    font-size: 0.7rem;
    margin-top: 1rem;
  }
</style>
