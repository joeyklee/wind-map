<script>
	// @ts-check
	import 'mapbox-gl/dist/mapbox-gl.css';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

	export let map;
	export let mapId = 'my-map';
	export let mapZoom = 7.5;
	export let mapCenter = /** @type {[number,number]} **/ ([-118.26600115038765, 34.04756377089244]);
	export let mapLoaded = false;
	export let mapStyleLoaded = false;

	/**
	 * @type {HTMLElement}
	 */
	let container;

	onMount(() => {
		mapboxgl.accessToken = ACCESS_TOKEN;

		map = new mapboxgl.Map({
			container,
			style: 'mapbox://styles/mapbox/streets-v11',
			projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
			zoom: mapZoom,
			center: mapCenter
		});

		map.on('load', () => {
			mapLoaded = true;
		});
		map.on('style.load', () => {
			mapStyleLoaded = true;
		});
	});
</script>

<div bind:this={container} id={mapId} class="my-map">
	<slot />
</div>

<style>
	.my-map {
		width: 100%;
		height: 100%;
		background-color: #eee;
		min-height: 48px;
	}
</style>
