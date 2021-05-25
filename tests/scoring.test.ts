import { calculateScore, calculateLevel } from "../tetris_modules/scoring";

describe("score", () => {
	it("should return the proper score", () => {
		expect(calculateScore(4)(2)).toStrictEqual(3600);
	});
	it("should rollover the line clears", () => {
		expect(calculateScore(8)(2)).toStrictEqual(3600);
	});
	it("if negative or zero line clears should return 0", () => {
		expect(calculateScore(-8)(2)).toStrictEqual(0);
	});
});
describe("level", () => {
	it("should return the proper level", () => {
		expect(calculateLevel(100)).toStrictEqual(4);
	});
	it("if negative or zero line clears should return 0", () => {
		expect(calculateLevel(-8)).toStrictEqual(0);
	});
});
