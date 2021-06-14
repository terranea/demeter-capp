<script context="module">
	export const prerender = true;
</script>

<script>
	import Item from '$lib/Feed/Item.svelte'
	import {requests} from '$lib/stores/requests'
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
<h1>Recent Activity</h1>

<div class="feed">
	{#each $requests as r}
		<Item id={r.id} kind={r.kind} description={r.description} parcel={r.parcel_id}/>
	{/each}
</div>

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
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
