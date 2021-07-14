import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter(),
		vite: {
			optimizeDeps: {
				exclude: ['@urql/svelte', 'subscriptions-transport-ws'],
			}
		}
	}
};

export default config;
