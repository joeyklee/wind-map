import { Vector } from '@joeyklee/whateverest-vector';

export interface FieldPoint {
	coords: number[];
	acceleration: Vector;
	u: number;
	v: number;
}

export interface FieldProperties {
	u: number;
	v: number;
}
