<script>
  export let reason = "";
  export let parcel = "";
  export let id;
  export let status;
  export let title;
  export let expires;

  function date(d) {
    var myDate = new Date(d);
    const format = { year: "numeric", month: "short", day: "numeric" };
    return myDate.toLocaleDateString("en-EN", format);
  }
</script>

<a href={`/requests/${id}`}>
<div class="item">
    <h2>{title}</h2>
    <p><strong>Reason:</strong> {reason}</p>
    <div class="row">
      <div class="batch">Parcel: {parcel}</div>
      <div class="batch">Submission until: {date(expires)}</div>
    </div>
    <div class="batch status">Status: <i>{status}</i></div>
  </div>
</a>

<style>
  .item {
    position: relative;
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

  .row {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .batch {
    display: flex;
    justify-content: center;
    font-size: 0.7rem;
    background-color: #0000000d;
    padding: .3rem .4rem;
    border-radius: 4px;
  }

  .status {
    position: absolute;
    font-weight: 600;
    color: #000;
    right: 8px;
    top: 8px;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset
  }

  i {
    color: #000;
    margin-left: .3rem;
  }

</style>
