<script>
	import * as turf from '@turf/turf';
	import FlowField from '$lib/FlowField/FlowField';
	import Mover from '$lib/Mover/Mover';
	import { onMount } from 'svelte';
	import { fieldList, parseTimestampFromFileName } from '$lib/WindData';
	import { base } from '$app/paths';

	/**
	 * @type {import('mapbox-gl').Map}
	 */
	export let map;
	export let width = 0;
	export let height = 0;
	export let timestamp;

	/**
	 * @type {function}
	 */
	export let projectionHandler;

	const DEBUG = false;

	// define some consts
	export let MOVER_COUNT = 1000;
	const FLOW_FIELD_UPDATE_MS = 1000 * 10;

	let fieldListCounter = 0;

	/**
	 * @type {null|string}
	 */
	$: timestamp =
		(fieldListCounter >= 0 &&
			(() => {
				const fileName = fieldList[fieldListCounter].data;
				return parseTimestampFromFileName(fileName);
			})()) ||
		null;

	onMount(async () => {
		// This is the code we need to create our own canvas to render on
		// get the map canvas, and add a canvas on top that we can work with
		const container = map.getCanvasContainer();
		const canvas = document.createElement('canvas');
		container.append(canvas);
		canvas.setAttribute('width', String(width));
		canvas.setAttribute('height', String(height));
		canvas.style.position = 'absolute';
		canvas.style.zIndex = String(2);
		const ctx = canvas.getContext('2d');

		// Define a bounding box where your movers are going to spawn from
		/**
		 * @type {import('geojson').BBox}
		 */
		const bbox = [-119.68271409305416, 33.28492388432518, -116.5798857475649, 35.092658659523266];
		// Set the number of mobers
		const numberOfMovers = MOVER_COUNT;
		// create a bunch of random points that we'll use to create our movers
		const randomPointsInBbox = turf.randomPoint(numberOfMovers, {
			bbox
		});
		// create your movers
		const movers = randomPointsInBbox.features.map((feat) => {
			return new Mover(feat.geometry.coordinates, bbox, { maxLifetime: 100, maxPoints: 30 });
		});

		// create your flow field
		const field = new FlowField();
		// load your data to populate the field from the data
		timestamp = parseTimestampFromFileName(fieldList[0].data);
		await field.load(`./${fieldList[0].data}`, `./${fieldList[0].index}`);

		// update the flow field at some interval
		setInterval(async () => {
			fieldListCounter += 1;
			if (fieldListCounter > fieldList.length - 1) {
				fieldListCounter = 0;
			}
			if (DEBUG) {
				console.log('loading next!!');
			}
			await field.load(
				`${base}/${fieldList[fieldListCounter].data}`,
				`${base}/${fieldList[fieldListCounter].index}`
			);
		}, FLOW_FIELD_UPDATE_MS);

		// Put it all together -- each frame will render this view
		function render() {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);

			movers.forEach((mover) => {
				mover.intersects(field.field, field.index);
				mover.update();
				mover.render(ctx, projectionHandler);
			});

			if (DEBUG) {
				field.render(ctx, projectionHandler);
			}
		}

		// This renders the scene as quickly as possible
		function animate() {
			requestAnimationFrame(animate);

			render();
		}

		render(); // Call once to render
		animate(); // animate over

		// handle the view state updates
		map.on('viewreset', render);
		// map.on('move', render);
		map.on('moveend', render);
	});
</script>
