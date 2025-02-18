// @ts-check
import { lengthToDegrees, randomPosition } from '@turf/turf';
// @ts-ignore
import whateverestVector from '@joeyklee/whateverest-vector';
import { Graphics } from 'pixi.js';

/**
 * @typedef {{
 * maxPoints?: number;
 * maxSpeed?: number;
 * maxForce?: number;
 * maxLifetime?: number;
 * effectiveDistance?: number;
 * }} MOVER_OPTIONS
 */
const DEFAULT_OPTIONS = {
	maxPoints: 50,
	maxSpeed: 6,
	maxForce: 0.2,
	maxLifetime: 100,
	effectiveDistance: lengthToDegrees(3, 'kilometers')
};

export default class Mover {
	/**
	 *
	 * @param {number[]} param0
	 * @param {import('geojson').BBox} bbox
	 * @param {MOVER_OPTIONS} options
	 */
	constructor([lng, lat], bbox, options = /** @type {MOVER_OPTIONS} */ ({})) {
		const { maxPoints, maxSpeed, maxForce, maxLifetime, effectiveDistance } = {
			...DEFAULT_OPTIONS,
			...options
		};
		/**
		 * @type {import('@joeyklee/whateverest-vector').Vector[]}
		 */
		this.points = [];
		this.maxPoints = maxPoints;
		this.fieldCell = null;
		this.location = whateverestVector({ x: lng, y: lat });
		this.velocity = whateverestVector({ x: 0, y: 0 });
		this.acceleration = whateverestVector({ x: 0, y: 0 });
		this.maxSpeed = maxSpeed;
		this.maxForce = maxForce;
		this.bbox = bbox;
		this.lifetime = 0;
		this.maxLifetime = maxLifetime;
		this.effectiveDistance = effectiveDistance;
		this.circles = [];
	}

	reset(app) {
		if (
			this.lifetime > this.maxLifetime ||
			this.location.location.x >= this.bbox[2] ||
			this.location.location.x <= this.bbox[0] ||
			this.location.location.y >= this.bbox[3] ||
			this.location.location.y <= this.bbox[1]
		) {
			const randomP = randomPosition(this.bbox);
			this.location = whateverestVector({ x: randomP[0], y: randomP[1] });
			this.lifetime = 0;
		}
	}

	update(app) {
		if (!this.fieldCell) {
			return;
		}
		this.reset(app);
		// What is the vector at that spot in the flow field?
		let desired = this.fieldCell.acceleration;
		// Scale it up by maxspeed
		desired = desired.multiply(desired, this.maxSpeed);
		// Steering is desired minus velocity
		let steer = desired.subtract(desired, this.velocity);
		steer = steer.limit(steer, this.maxForce); // Limit to maximum steering force
		this.acceleration = this.acceleration.add(this.acceleration, steer);

		// velocity
		this.velocity = this.velocity.add(this.velocity, this.acceleration);
		this.velocity = this.velocity.limit(this.velocity, this.maxSpeed);
		// location
		this.location = this.location.add(this.location, this.velocity);
		// reset the acceleration on each iteration
		this.acceleration = this.acceleration.multiply(this.acceleration, 0);

		this.points.push([this.location.location.x, this.location.location.y]);

		this.points = this.points.slice(-this.maxPoints);

		this.lifetime += 1;
	}

	/**
	 *
	 * @param {import('../FlowField/types.d').FieldPoint[] | null} field
	 * @param {import('kdbush').default | null} index
	 */
	intersects(field, index) {
		if (!field) return;
		if (!index) return;

		const [x, y] = [this.location.location.x, this.location.location.y];
		const neighborIds = index.within(x, y, this.effectiveDistance);

		const foundItems = neighborIds.map((i) => field[i]);
		this.fieldCell = foundItems[0];
	}

	/**
	 *
	 * @param {import('pixi.js').Application.stage} app
	 * @param {function} handleProjection
	 */
	render(app, handleProjection) {
		if (!this.points.length && !this.circles.length) return;
		this.points.forEach((location, idx) => {
			const point = handleProjection([location[0], location[1]]);
			const circle = this.circles[idx];
			circle.x = point.x;
			circle.y = point.y;
		});
	}
}
