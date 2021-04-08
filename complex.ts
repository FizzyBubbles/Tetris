import { Complex } from "./types";
import diff from "jest-diff";

// adds two complex numbers
export const add = (n1: Complex) => (n2: Complex): Complex => ({
	x: n1.x + n2.x,

	y: n1.y + n2.y
});

// stubtracts a number from another
export const subtract = (difference: Complex) => (
	number: Complex
): Complex => ({
	x: number.x - difference.x,

	y: number.y - difference.y
});

// multiplies two complex numbers -> This is the expanded form of (a+bi)(c+di)
export const multiply = (n1: Complex) => (n2: Complex): Complex => ({
	x: n1.x * n2.x - n1.y * n2.y,

	y: n1.y * n2.x + n1.x * n2.y
});

// takes an angle in radians and returns the complex unit vector in that angle
export const cis = (angle: number): Complex => ({
	x: Math.cos(angle),
	y: Math.sin(angle)
});

// rotates by whatever angle given (in radians)
export const rotate = (angle: number) => (position: Complex): Complex =>
	multiply(cis(angle))(position);

export const ID = <A>(a: A): A => a;
