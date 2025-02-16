<script>
	import { base } from '$app/paths';
	import MapboxWindMap from '$lib/MapboxWindMap/index.svelte';
</script>

<div class="wrapper">
	<div class="container">
		<h1 class="title">Flow Fields! Vectors! Wind maps!</h1>
		<div class="map-container">
			<MapboxWindMap MOVER_COUNT={1000} />
		</div>
		<p class="description">
			This is my own version of a "wind map." At its core is an implementation of a "<a
				href="https://natureofcode.com/autonomous-agents/"
				target="_blank">flow field</a
			>" from Dan Shiffman's
			<a href="https://natureofcode.com/" target="_blank">Nature of Code</a>
			(Hi Dan!). There are lots of different approaches to building
			<a
				target="_blank"
				href="https://blog.mapbox.com/how-i-built-a-wind-map-with-webgl-b63022b5537f">wind maps</a
			>
			out there already so I hope this approach might reveal something new or different. You'll find
			demos versions built for
			<a href="{base}/maplibre-wind-map">Maplibregl</a>
			and <a href="{base}/mapbox-wind-map">Mapboxgl</a>. You can find the
			<a href="https://github.com/joeyklee/wind-map" target="_blank">code</a> here if you're curious
			❤
		</p>
		<p class="note">
			Note: this approach currently doesn't really scale well for large geographic extents but could
			be sped up by taking better care of memory usage and trying to render in webgl instead of
			canvas!
		</p>
	</div>
</div>

<style>
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
		margin-bottom: 10px;
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
</style>
