<script>
	import MaplibreWindMap from '$lib/MaplibreWindMap/index.svelte';
	console.log('hello!');

	/**
	 * @type {string|null}
	 */
	let timestamp;
</script>

<div class="app">
	<div class="app-content">
		<div class="header">
			<h2 class="title">3 hours of wind over LA</h2>
			<p class="timestamp">{timestamp}</p>
		</div>
		<MaplibreWindMap bind:timestamp />
		<p class="description">
			Data from the <a href="https://www.nco.ncep.noaa.gov/pmb/products/rtma/"
				>National Ocean and Atmospheric Association</a
			>. The map shows the hourly Real-time Mesocale Analysis (RTMA) product for wind speeds at 10 m
			(32 ft) height and 2.5 km<sup>2</sup> (1.5 mi) resolution.
		</p>
	</div>
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
	.header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
	.app {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.app-content {
		width: 100%;
		height: 480px;
		margin: 0 auto;
		max-width: 600px;
	}

	.title {
		font-family: Arial, Helvetica, sans-serif;
		font-weight: bold;
		font-size: 18px;
		line-height: 16px;
	}
	.timestamp {
		font-family: Arial, Helvetica, sans-serif;
		font-weight: normal;
		font-size: 14px;
		line-height: 17px;
	}
	.description {
		font-family: Arial, Helvetica, sans-serif;
		font-weight: normal;
		font-size: 11px;
		line-height: 14px;
		margin-top: 0.5rem;
		color: #666;
	}
	a {
		color: inherit;
	}
</style>
