import { Complex } from "../tetris_modules/types";
const sum = (x: number, y: number) => {
	return x + y;
};
import { add, multiply, subtract } from "../tetris_modules/complex";

describe("add", () => {
	it("should add together two complex vectors X components and their Y components", () => {
		expect(add({ x: 1, y: 2 })({ x: 3, y: 4 })).toStrictEqual({ x: 4, y: 6 });
	});
	it("should add together negative vectors", () => {
		expect(add({ x: -1, y: -2 })({ x: 3, y: 4 })).toStrictEqual({ x: 2, y: 2 });
	});
	it("should add together zero vectors", () => {
		expect(add({ x: 0, y: 0 })({ x: 0, y: 0 })).toStrictEqual({ x: 0, y: 0 });
	});
	it("should add together non integer numbers", () => {
		expect(add({ x: 0.5, y: 0.78 })({ x: 9.7, y: -6.9 })).toStrictEqual({
			x: 10.2,
			y: -6.12
		});
	});
});

describe("multiply", () => {
	it("should multiply together two complex vectors to equal (a+bi)(c+di)", () => {
		expect(multiply({ x: 2, y: 2 })({ x: 4, y: 5 })).toStrictEqual({
			x: -2,
			y: 18
		});
	});
	it("should multiply together negative vectors", () => {
		expect(multiply({ x: -5, y: -2 })({ x: 4, y: -4 })).toStrictEqual({
			x: -28,
			y: 12
		});
	});
	it("should mulitply together zero vectors", () => {
		expect(multiply({ x: 0, y: 0 })({ x: 2, y: 4 })).toStrictEqual({
			x: 0,
			y: 0
		});
	});
	it("should multiply together non integer numbers", () => {
		expect(multiply({ x: 0.5, y: 0.78 })({ x: 9.7, y: -6.9 })).toStrictEqual({
			x: 10.232,
			y: 4.116
		});
	});
});

describe("subtract", () => {
	it("should subtract vector 1 from vector 2", () => {
		expect(subtract({ x: 1, y: 2 })({ x: 3, y: 4 })).toStrictEqual({
			x: 2,
			y: 2
		});
	});
	it("should subtract negative vectors", () => {
		expect(subtract({ x: -1, y: -2 })({ x: 3, y: 4 })).toStrictEqual({
			x: 4,
			y: 6
		});
	});
	it("should subtract zero vectors", () => {
		expect(subtract({ x: 0, y: 0 })({ x: 0, y: 3 })).toStrictEqual({
			x: 0,
			y: 3
		});
	});
	it("should subtract non integer vectors", () => {
		expect(subtract({ x: 0.5, y: 0.78 })({ x: 9.7, y: -6.9 })).toStrictEqual({
			x: 9.2,
			y: -7.68
		});
	});
});
