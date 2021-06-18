import {
	rowIsFull,
	newGameBoard,
	fullRows,
	hardDrop
} from "./../tetris_modules/collision";
import { CELL } from "./../tetris_modules/constants";
import { GameBoard } from "../tetris_modules/types";

// describe("relative position", () => {
// 	it("should edit the ", relativePos);
// });

describe("newGameBoard", () => {
	it("should return a game board of specified size", () =>
		expect(newGameBoard(2)(3)).toStrictEqual([
			[CELL.EMPTY, CELL.EMPTY],
			[CELL.EMPTY, CELL.EMPTY],
			[CELL.EMPTY, CELL.EMPTY]
		]));
});

describe("rowIsFull", () => {
	it("should return false when row is empty", () =>
		expect(
			rowIsFull([CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY])
		).toStrictEqual(false));

	it("should return true when row is full", () =>
		expect(
			rowIsFull([
				CELL.I_PIECE,
				CELL.I_PIECE,
				CELL.I_PIECE,
				CELL.I_PIECE,
				CELL.J_PIECE
			])
		).toStrictEqual(true));

	it("should return false when row is semi empty", () =>
		expect(
			rowIsFull([
				CELL.I_PIECE,
				CELL.EMPTY,
				CELL.J_PIECE,
				CELL.EMPTY,
				CELL.O_PIECE
			])
		).toStrictEqual(false));
});

describe("fullRows", () => {
	it("should return a list of booleans matching the rowIsFull output", () =>
		expect(
			fullRows([
				[CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY],
				[CELL.I_PIECE, CELL.I_PIECE, CELL.I_PIECE, CELL.I_PIECE, CELL.J_PIECE],
				[CELL.I_PIECE, CELL.EMPTY, CELL.J_PIECE, CELL.EMPTY, CELL.O_PIECE]
			])
		).toStrictEqual([false, true, false]));
});
