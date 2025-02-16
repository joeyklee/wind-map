<script>
	// @ts-check
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import { onMount } from 'svelte';

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
		map = new maplibregl.Map({
			container,
			style: {
				id: 'raster',
				version: 8,
				name: 'Raster tiles',
				center: [0, 0],
				zoom: 0,
				sources: {
					'raster-tiles': {
						type: 'raster',
						tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
						tileSize: 256,
						minzoom: 0,
						maxzoom: 19
					}
				},
				layers: [
					{
						id: 'background',
						type: 'background',
						paint: {
							'background-color': '#e0dfdf'
						}
					},
					{
						id: 'simple-tiles',
						type: 'raster',
						source: 'raster-tiles'
					}
				]
			},
			zoom: mapZoom,
			center: mapCenter
		});

		map.on('load', () => {
			mapLoaded = true;
			map.setProjection('mercator');
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
