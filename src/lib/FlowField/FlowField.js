// @ts-check
import KDBush from 'kdbush';
// @ts-ignore
import whateverestVector from '@joeyklee/whateverest-vector';

const DEFAULT_OPTIONS = {
	dampenCoefficient: 0.0001
};

export default class FlowField {
	constructor(options = {}) {
		const { dampenCoefficient } = {
			...DEFAULT_OPTIONS,
			...options
		};
		/*** @type {import('./types.d').FieldPoint[] | null} */
		this.field = null;
		this.index = null;
		this.dampenCoefficient = dampenCoefficient;
	}

	/**
	 *
	 * @param {string} dataUrl
	 * @param {string} indexUrl
	 */
	async load(dataUrl, indexUrl) {
		const res = await fetch(dataUrl).then((d) => d.json());
		const indexRes = await fetch(indexUrl).then((d) => d.arrayBuffer());
		this.index = KDBush.from(indexRes);
		this.update(res);
	}

	/**
	 * @param {import('geojson').FeatureCollection<import('geojson').Point, import('./types.d').FieldProperties>} fc
	 */
	update(fc) {
		this.field = fc.features.map((feat) => {
			return {
				...feat.properties,
				coords: feat.geometry.coordinates,
				acceleration: whateverestVector({
					x: feat.properties.u * this.dampenCoefficient,
					y: feat.properties.v * this.dampenCoefficient
				})
			};
		});
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {function} handleProjection
	 */
	render(ctx, handleProjection) {
		if (!this.field) return;
		this.field.forEach((feat) => {
			const point = handleProjection(feat.coords);
			ctx.save();
			ctx.translate(point.x, point.y);

			ctx.strokeStyle = 'rgba(0,0,0, 0.5)';
			ctx.beginPath();
			// u is the east-west wind component, v is the north-south wind component
			ctx.moveTo(feat.u, 0);
			ctx.lineTo(0, feat.v);
			ctx.stroke();
			ctx.restore();
		});
	}
}
