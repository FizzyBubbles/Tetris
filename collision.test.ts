const sum = (x: number, y: number) => {
	return x + y;
};
describe("sum", () => {
	it("should add together two positive numbers", () => {
		expect(sum(1, 2)).toBe(3);
	});
	it("should add together negative numbers", () => {
		expect(sum(-1, -2)).toBe(-3);
	});
	it("should add together 0", () => {
		expect(sum(0, 0)).toBe(0);
	});
});
