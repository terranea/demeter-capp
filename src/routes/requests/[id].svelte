<script context="module">
  export async function load({page}) {
    const id = page.params.id;
    const url = `http://192.168.178.21:8082/api/rest/requests/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    return {props: {data: data.requests_by_pk}}
  }
</script>

<script>
  export let data;
</script>

<h1>Request</h1>
<p>{data.description}</p>