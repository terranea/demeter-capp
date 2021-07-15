<script>
  export let reason = "";
  export let parcel = "";
  export let id;
  export let status;
  export let title
</script>

<a href={`/requests/${id}`}>
<div class="item">
    <h2>{title}</h2>
    <p>{reason}</p>
    <div class="parcel">Parcel: {parcel}</div>
  </div>
</a>

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
