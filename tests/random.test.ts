import { randomPiece } from "./../tetris_modules/random";
import { PIECES, PIECE } from "../tetris_modules/constants";

expect.extend({
	toBeWithinRange(received: number, floor: number, ceiling: number) {
		const pass = received >= floor && received <= ceiling;
		if (pass) {
			return {
				message: () =>
					`expected ${received} not to be within range ${floor} - ${ceiling}`,
				pass: true
			};
		} else {
			return {
				message: () =>
					`expected ${received} to be within range ${floor} - ${ceiling}`,
				pass: false
			};
		}
	}
});

// describe("randomPiece", () => {
// 	it(
// 		"should return a random piece in the range of random pieces",
// 		expect(randomPiece()).toContain(PIECES)

// 	);
// });
