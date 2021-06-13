import { Complex } from "./types";

// adds two complex numbers
export const add = (n1: Complex) => (n2: Complex): Complex => ({
	x: Number((n1.x + n2.x).toFixed(5)),

	y: Number((n1.y + n2.y).toFixed(5))
});

// stubtracts a number from another
export const subtract = (difference: Complex) => (
	number: Complex
): Complex => ({
	x: Number((number.x - difference.x).toFixed(3)),

	y: Number((number.y - difference.y).toFixed(3))
});

// multiplies two complex numbers -> This is the expanded form of (a+bi)(c+di)
export const multiply = (n1: Complex) => (n2: Complex): Complex => ({
	x: Number((n1.x * n2.x - n1.y * n2.y).toFixed(5)),

	y: Number((n1.y * n2.x + n1.x * n2.y).toFixed(5))
});

// takes an angle in radians and returns the complex unit vector in that angle
export const cis = (angle: number): Complex => ({
	x: Number(Math.cos(angle).toFixed(5)),
	y: Number(Math.sin(angle).toFixed(5))
});

// rotates by whatever angle given (in radians)
export const rotate = (angle: number) => (position: Complex): Complex =>
	multiply(cis(angle))(position);

export const ID = <A>(a: A): A => a;
