<script>
	import { base } from '$app/paths';
	import MapboxWindMapPixi from '$lib/MapboxWindMapPixi/index.svelte';
	let timestamp;
</script>

<div class="wrapper">
	<div class="container">
		<h1 class="title">Flow Fields! Vectors! Wind maps!</h1>
		<div class="map-container">
			<MapboxWindMapPixi MOVER_COUNT={5000} bind:timestamp />
			<p class="timestamp">Data: NOAA · {timestamp}</p>
		</div>
		<p class="description">
			Behold! A wind map! While there are already a lot of different approaches to building
			<a
				target="_blank"
				href="https://blog.mapbox.com/how-i-built-a-wind-map-with-webgl-b63022b5537f">wind maps</a
			>
			out there, I have long wanted to bake my own. At its core is an implementation of a "<a
				href="https://natureofcode.com/autonomous-agents/"
				target="_blank">flow field</a
			>" from Dan Shiffman's
			<a href="https://natureofcode.com/" target="_blank">Nature of Code</a>
			(Hi Dan!). You'll find demo versions built for Maplibre (<a href="{base}/maplibre-wind-map"
				>canvas</a
			>
			and <a href="{base}/maplibre-wind-map-pixi">Webgl with Pixi.js</a>) and Mapboxgl (<a
				href="{base}/mapbox-wind-map">canvas</a
			>
			and
			<a href="{base}/mapbox-wind-map-pixi">Webgl with Pixi.js</a>). You can
			<a href="https://github.com/joeyklee/wind-map" target="_blank"
				>find the code here at @joeyklee/wind-map</a
			> ❤.
		</p>
		<p class="note">
			Note: this approach currently doesn't scale super well for large geographic extents at the
			moment (the current flow field is read in as a geojson point grid). The example here is using
			Webgl via Pixi.js to animate 5K movers × 15 trailing points = 75K particles 😱!
		</p>
	</div>
</div>

<style>
	.timestamp {
		display: block;
		margin: 3px;
		font-size: 10px;
		color: #666;
		line-height: 14px;
		text-align: left;
	}
	* {
		box-sizing: border-box;
	}
	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}
	.title {
		margin-bottom: 10px;
	}
	.map-container {
		width: 100%;
		height: 360px;
		margin-bottom: 25px;
	}
	.note {
		font-size: 10px;
		color: #666;
		line-height: 14px;
	}
	.container {
		font-family: monospace;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-width: 600px;
	}
	p.description {
		color: black;
		margin: 5px 0 10px;
		font-size: 14px;
		line-height: 21px;
	}
	a {
		color: inherit;
		text-decoration: underline;
	}
	@media (max-width: 600px) {
		.wrapper {
			align-items: flex-start;
		}
		.container {
			display: block;
		}
	}
</style>
