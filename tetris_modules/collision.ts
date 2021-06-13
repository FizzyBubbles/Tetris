import {
	getKickRotationState,
	kickTestPositionsMap,
	IPieceKickTestPositionsMap
} from "./kickUtils";
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
	// maps the vector with the position vector to give the relative piece location to the board
	const pieceLocation = relativePos(gameState.piece)(gameState.pos);
	let failed = false;
	for (let i = 0; i < pieceLocation.length; i++) {
		// iterates through each position vector to see if it overlaps with the top of the board
		if (pieceLocation[i].y < 0) {
			failed = true;
			i = pieceLocation.length; // ends the loop if failed
		}
	}
	return failed;
};

// never used
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

// maps the position to each of the vectors that make up a piece
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

// never used
export const emptyRow = (length: number) => {
	let row: number[] = [];
	for (let i = 0; i < length; i++) {
		row = [...row, CELL.EMPTY];
	}
	return row;
};

// applies rowIsFull to every row in a GameBoard
export const fullRows = (board: GameBoard): boolean[] =>
	board.map(row => rowIsFull(row));

// if a row has no empty cells it will return true
export const rowIsFull = (row: number[]): boolean => !row.includes(CELL.EMPTY);

// never used
export const clearLine = (board: GameBoard) => (
	rowIndex: number
): GameBoard => [
	board.slice(rowIndex, rowIndex + 1).map(() => 0),
	...board.slice(0, rowIndex),
	...board.slice(rowIndex + 1)
];

// removes all rows that are full and adds empty rows to the top of the board
export const clearFullRows = (board: GameBoard): GameBoard => {
	const numberOfRows = board.length;
	const filteredBoard = board.filter(row => row.includes(CELL.EMPTY)); // removes full rows
	return [
		...newGameBoard(10)(numberOfRows - filteredBoard.length), // empty rows
		...filteredBoard
	];
};

export const numFullRows = (board: GameBoard) =>
	fullRows(board).reduce(
		(accumulator, currentValue) => accumulator + (currentValue ? 1 : 0),
		0
	); // uses a reduce function to count the number of full rows on the current game board

export const addPieceToGrid = (gameState: GameState): GameState => {
	let GS = cloneDeep(gameState); // clones the game state

	// goes through each piece and adds it to whichever square the top left corner of the piece is in
	relativePos(GS.piece)(GS.pos).forEach(square => {
		if (Math.trunc(square.y) >= 0 && Math.trunc(square.x) >= 0) {
			GS.board[Math.trunc(square.y)][Math.trunc(square.x)] = GS.piece.id;
		}
	});
	return GS;
};

/**
 * This is a curried function that will give you a transformation of
 * A "wallKick" is a
 * https://tetris.fandom.com/wiki/Wall_kick
 *
 * @param state current game state
 * @param oldRotationState the old rotation state
 *
 * @returns new position vector based on the "kick" or null if there is no wall kick
 */
export const calculateWallKickPosition = (state: GameState) => (
	oldRotationState: RotationState
): Complex | null => {
	let adjustment: Complex | null = { x: 0, y: 0 }; // the default adjustment is (0,0)

	// goes through all the test positions and returns the first displacement that doesn't collide, if none are passed it returns null
	const checkWallKick = (testPositions: Complex[]): Complex | null => {
		for (let testPosIndex in testPositions) {
			if (
				!pieceCollided({
					...state,
					pos: add(state.pos)(testPositions[testPosIndex])
				})
			) {
				return testPositions[testPosIndex];
			}
		}
		return null;
	};

	const kickRotationState = getKickRotationState(
		oldRotationState,
		state.piece.rotationState
	); // gets the kick rotation state

	// The I Piece has its own seperate test cases, this checks what tests the piece must go through
	if (state.piece.name == "I_PIECE") {
		adjustment = checkWallKick(IPieceKickTestPositionsMap[kickRotationState]); // gets the final I piece adjustment
	} else {
		adjustment = checkWallKick(kickTestPositionsMap[kickRotationState]); // gets the final non I piece adjustment
	}
	return adjustment;
};

export const hardDrop = (
	state: GameState
): GameState => // recursively finds the lowest position the piece can be before collision
	pieceCollided({ ...state, pos: down(state.pos) })
		? state
		: hardDrop({ ...state, pos: down(state.pos) });
