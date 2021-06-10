import { statement } from "@babel/template";
import {
	Complex,
	Piece,
	GameState,
	GameBoard,
	Transformation,
	RotationState
} from "./types";
import { gameCanvas } from "./drawUtils";
import { add, multiply } from "./complex";
import { CELL, PIECE } from "./constants";
import { arrayExpression } from "@babel/types";
import { Z_FILTERED } from "zlib";
import { cloneDeep } from "lodash";
import {
	left,
	rotateAntiClockwise,
	rotateClockwise,
	rotate180,
	down
} from "./reducerHelpers";

// returns a game board of specified size with each value being an empty cell
export const newGameBoard = (rowLength: number) => (
	columns: number
): GameBoard => {
	let constructedBoard: GameBoard = [];
	for (let col = 0; col < columns; col++) {
		// loops through the columns and pushes the rows of empty cells into the 2d array game board
		let constructedRow = [];
		for (let row = 0; row < rowLength; row++) {
			// creates rows of empty cells at a specified length
			constructedRow.push(CELL.EMPTY);
		}
		// pushes the constructed row into the game board
		constructedBoard.push(constructedRow);
	}
	return constructedBoard;
};

// const newGameBoard = (rowLength: number) => (columns: number): GameBoard =>
// 	Array(columns).fill(emptyRow(rowLength)); // TODO: describe this (lol this just does everything that happens in the other function)

export const failed = (gameState: GameState): boolean => {
	const pieceLocation = relativePos(gameState.piece)(gameState.pos);
	let failed = false;
	for (let i = 0; i < pieceLocation.length; i++) {
		if (pieceLocation[i].y < 0) {
			failed = true;
			i = pieceLocation.length;
		}
	}
	return failed;
};
// checks if two pieces have collided
export const squareCollision = (position1: Complex) => (position2: Complex) => {
	if (!gameCanvas) return;
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;
	return (
		position1.x < position2.x + WIDTH &&
		position1.x + WIDTH > position2.x &&
		position1.y < position2.y + HEIGHT &&
		position1.y + HEIGHT > position2.y
	);
};

export const relativePos = (piece: Piece) => (position: Complex) =>
	piece.shape.map(blockPosition => add(blockPosition)(position)); // returns the position of all the blocks in a piece plus the position.

export const pieceCollided = (gameState: GameState) => {
	const pieceLocation = relativePos(gameState.piece)(gameState.pos);
	let collided = false;
	for (let i = 0; i < pieceLocation.length; i++) {
		// console.log("x: " + pieceLocation[i].x, "y: " + pieceLocation[i].y);
		if (
			pieceLocation[i].x < 0 || // checks if piece location is left of the boundary
			pieceLocation[i].x >= 10 || // checks if piece location to the right of the boundary
			pieceLocation[i].y >= 20 // checks if piece location is above the bottom
		) {
			collided = true;
		} else if (pieceLocation[i].y >= 0) {
			// checks if piece location is lower than the top )
			if (
				gameState.board[Math.trunc(pieceLocation[i].y)][
					Math.trunc(pieceLocation[i].x)
				]
			) {
				collided = true;
			}
		}
	}
	return collided;
};

export const emptyRow = (length: number) => {
	let row: number[] = [];
	for (let i = 0; i < length; i++) {
		row = [...row, CELL.EMPTY];
	}
	return row;
};

export const fullRows = (board: GameBoard): boolean[] =>
	board.map(row => rowIsFull(row));

export const rowIsFull = (row: number[]): boolean => !row.includes(CELL.EMPTY);

export const clearLine = (board: GameBoard) => (
	rowIndex: number
): GameBoard => [
	board.slice(rowIndex, rowIndex + 1).map(() => 0),
	...board.slice(0, rowIndex),
	...board.slice(rowIndex + 1)
];

export const clearFullRows = (board: GameBoard): GameBoard => {
	const numberOfRows = board.length;
	const filteredBoard = board.filter(row => row.includes(CELL.EMPTY));
	return [
		...newGameBoard(10)(numberOfRows - filteredBoard.length),
		...filteredBoard
	];
};

export const numFullRows = (board: GameBoard) =>
	fullRows(board).reduce(
		(accumulator, currentValue) => accumulator + (currentValue ? 1 : 0),
		0
	);

export const addPieceToGrid = (gameState: GameState): GameState => {
	let GS = cloneDeep(gameState);

	relativePos(GS.piece)(GS.pos).forEach(square => {
		if (Math.trunc(square.y) >= 0 && Math.trunc(square.x) >= 0) {
			GS.board[Math.trunc(square.y)][Math.trunc(square.x)] = GS.piece.id;
		}
	});
	return GS;
};

/**
 * This is a curried function that s
 * A "wallKick" is a
 * https://tetris.fandom.com/wiki/Wall_kick
 *
 * @param state
 *
 * @returns new position vector based on the "kick" or null if there is no wall kick
 */
export const calculateWallKickPosition = (state: GameState) => (
	oldRotationState: RotationState
): Complex | null => {
	const tests0_1 = [
		// tests for state 0 to 1
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: -1 },
		{ x: 0, y: 2 },
		{ x: -1, y: 2 }
	];
	const tests1_0 = [
		// tests for state 1 to 0
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: -2 },
		{ x: 1, y: -2 }
	];
	const tests1_2 = [
		// tests for state 1 to 2
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: -2 },
		{ x: 1, y: -2 }
	];
	const tests2_1 = [
		// tests for state 2 to 1
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: -1 },
		{ x: 0, y: 2 },
		{ x: -1, y: 2 }
	];
	const tests2_3 = [
		// tests for state 2 to 3
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: -1 },
		{ x: 0, y: 2 },
		{ x: 1, y: 2 }
	];
	const tests3_2 = [
		// tests for state 3 to 2
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: 1 },
		{ x: 0, y: -2 },
		{ x: -1, y: -2 }
	];
	const tests3_0 = [
		// tests for state 3 to 2
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: 1 },
		{ x: 0, y: -2 },
		{ x: -1, y: -2 }
	];
	const tests0_3 = [
		// tests for any state into 3
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: -1 },
		{ x: 0, y: 2 },
		{ x: 1, y: 2 }
	];

	const Itests0_1 = [
		// tests for line flat to line vertical clockwise
		{ x: 0, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 1 },
		{ x: -1, y: -2 }
	];
	const Itests1_0 = [
		// tests for line vertical to line flat anti-clockwise
		{ x: 0, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: -1 },
		{ x: 1, y: 2 }
	];
	const Itests1_2 = [
		// tests for line vertical to line flat clockwise
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: -2 },
		{ x: -2, y: 1 }
	];
	const Itests2_3 = [
		// tests for line vertical to line flat anti-clockwise
		{ x: 0, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: -1 },
		{ x: 1, y: 2 }
	];
	const Itests3_2 = [
		// tests for line flat to line vertical clockwise
		{ x: 0, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 1 },
		{ x: -1, y: -2 }
	];

	const Itests0_3 = [
		// tests for line vertical to line flat clockwise
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: -2 },
		{ x: -2, y: 1 }
	];
	const Itests2_1 = [
		// tests for line flat to line vertical anti-clockwise
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 2 },
		{ x: 2, y: -1 }
	];
	const Itests3_0 = [
		// tests for line flat to line vertical anti-clockwise
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 2 },
		{ x: 2, y: -1 }
	];

	const checkWallKick = (testPositions: Complex[]): Complex | null => {
		for (let i in testPositions) {
			console.log(testPositions[i]);
			if (!pieceCollided({ ...state, pos: add(state.pos)(testPositions[i]) })) {
				return testPositions[i];
			}
		}
		return null;
	};
	let adjustment: Complex | null = { x: 0, y: 0 };
	if (state.piece.name == "I_PIECE") {
		switch (state.piece.rotationState) {
			case RotationState.Initial:
				adjustment =
					oldRotationState == RotationState.Clockwise
						? checkWallKick(Itests1_0)
						: checkWallKick(Itests3_0);
				break;
			case RotationState.Clockwise:
				adjustment =
					oldRotationState == RotationState.Initial
						? checkWallKick(Itests0_1)
						: checkWallKick(Itests2_1);
				break;
			case RotationState.Flip:
				adjustment =
					oldRotationState == RotationState.Clockwise
						? checkWallKick(Itests1_2)
						: checkWallKick(Itests3_2);
				break;
			case RotationState.AntiClockwise:
				adjustment =
					oldRotationState == RotationState.Initial
						? checkWallKick(Itests0_3)
						: checkWallKick(Itests2_3);
				break;
		}
	} else {
		switch (state.piece.rotationState) {
			case RotationState.Initial:
				adjustment =
					oldRotationState == RotationState.Clockwise
						? checkWallKick(tests1_0)
						: checkWallKick(tests3_0);
				break;
			case RotationState.Clockwise:
				adjustment =
					oldRotationState == RotationState.Initial
						? checkWallKick(tests0_1)
						: checkWallKick(tests2_1);
				break;
			case RotationState.Flip:
				adjustment =
					oldRotationState == RotationState.Clockwise
						? checkWallKick(tests1_2)
						: checkWallKick(tests3_2);
				break;
			case RotationState.AntiClockwise:
				adjustment =
					oldRotationState == RotationState.Initial
						? checkWallKick(tests0_3)
						: checkWallKick(tests2_3);
				break;
		}
	}
	return adjustment;
};

export const hardDrop = (
	state: GameState
): GameState => // recursively finds the lowest position the piece can be before collision
	pieceCollided({ ...state, pos: down(state.pos) })
		? state
		: hardDrop({ ...state, pos: down(state.pos) });
