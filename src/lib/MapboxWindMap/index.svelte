<script>
	// @ts-check
	import Map from './Map.svelte';
	import CanvasWindLayer from '../CanvasWindLayer/CanvasWindLayer.svelte';
	import mapboxgl from 'mapbox-gl';

	/**
	 * @type {null|string}
	 */
	export let timestamp = null;
	export let MOVER_COUNT = 10000;

	/**
	 * @type {import('mapbox-gl').Map}
	 */
	let map;
	/**
	 * @type {boolean}
	 */
	let mapLoaded = false;
	/**
	 * @type {number}
	 */
	let width;
	/**
	 * @type {number}
	 */
	let height;

	/**
	 *
	 * @param {number[]} d
	 */
	function project(d) {
		return map.project(new mapboxgl.LngLat(d[0], d[1]));
	}
</script>

<div class="app" bind:clientWidth={width} bind:clientHeight={height}>
	{#if width && height}
		<Map bind:map bind:mapLoaded>
			{#if mapLoaded && width && height && map}
				<CanvasWindLayer
					{map}
					{width}
					{height}
					bind:timestamp
					projectionHandler={project}
					{MOVER_COUNT}
				/>
			{/if}
		</Map>
	{/if}
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	:global(body, html) {
		width: 100%;
		height: 100%;
	}
	.app {
		width: 100%;
		height: 100%;
	}
</style>
