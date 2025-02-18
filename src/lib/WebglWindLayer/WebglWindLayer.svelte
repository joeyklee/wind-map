<script>
	// @ts-check
	import * as turf from '@turf/turf';
	import FlowField from '$lib/FlowField/FlowField';
	import Mover from '$lib/Mover/MoverPixi';
	import { onMount } from 'svelte';
	import { fieldList, parseTimestampFromFileName, bbox } from '$lib/WindData';
	import { base } from '$app/paths';
	import { Application, Graphics, ParticleContainer } from 'pixi.js';

	/**
	 * @type {import('mapbox-gl').Map}
	 */
	export let map;
	export let width = 0;
	export let height = 0;
	export let timestamp;
	export let MOVER_COUNT = 500;
	export let FLOW_FIELD_UPDATE_MS = 1000 * 10;
	export let moverOptions = { maxLifetime: 100, maxPoints: 15 };
	export let flowfieldOptions = {};

	/**
	 * @type {function}
	 */
	export let projectionHandler;

	const DEBUG = false;

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
		const app = new Application();

		await app.init({ backgroundAlpha: 0, width, height });
		const canvas = app.canvas;
		container.append(canvas);
		// canvas.setAttribute('width', String(width));
		// canvas.setAttribute('height', String(height));
		canvas.style.position = 'absolute';
		canvas.style.zIndex = String(2);
		// const ctx = canvas.getContext('2d');

		// Set the number of mobers
		const numberOfMovers = MOVER_COUNT;
		// create a bunch of random points that we'll use to create our movers
		const randomPointsInBbox = turf.randomPoint(numberOfMovers, {
			bbox
		});

		/**
		 * We need to do a few things so pixijs can render our particles
		 * 1. we create a circle and then generate a texture from it
		 * 2. we create a particleContainer which is a really cool feature of pixijs for dealing with, well, particles https://pixijs.com/blog/particlecontainer-v8
		 * 3. add that particleContainer to the pixi app
		 */
		// Create our circle and make a texture from it
		const newCircle = new Graphics();
		newCircle.circle(0, 0, 1.5);
		newCircle.fill({
			color: 'rgb(125, 77, 153)',
			alpha: 0.5
		});
		const texture = app.renderer.generateTexture(newCircle);
		// create our particle container
		const particleContainer = new ParticleContainer({
			dynamicProperties: {
				// Enable only what's necessary for your circles
				rotation: false,
				scale: false,
				position: true,
				alpha: false
			}
		});
		// add our particleContainer to our app
		app.stage.addChild(particleContainer);

		// create your movers
		const movers = randomPointsInBbox.features.map((feat) => {
			const myMover = new Mover(
				feat.geometry.coordinates,
				bbox,
				moverOptions,
				// our pixi options
				{
					texture,
					particleContainer
				}
			);
			return myMover;
		});

		// create your flow field
		const field = new FlowField(flowfieldOptions);
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
			movers.forEach((mover) => {
				// console.log('rendering!');
				mover.intersects(field.field, field.index);
				mover.update();
				mover.render(projectionHandler);
			});
		}

		app.ticker.add(() => {
			render();
		});

		// handle the view state updates
		map.on('viewreset', render);
		// map.on('move', render);
		map.on('moveend', render);
		map.on('zoomend', render);
	});
</script>
