import { Complex, Piece, GameState, GameBoard } from "./types";
import { CANVAS } from "./drawUtils";
import { add } from "./complex";
import { CELL } from "./constants";
import { arrayExpression } from "@babel/types";
import { Z_FILTERED } from "zlib";
import { cloneDeep } from "lodash";

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

// checks if two pieces have collided
export const squareCollision = (position1: Complex) => (position2: Complex) => {
	if (!CANVAS) return;
	const HEIGHT = CANVAS.clientHeight / 20;
	const WIDTH = CANVAS.clientWidth / 10;
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
// Array(length).fill(CELL.EMPTY);
// creates empty row
// concat
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

export const addPieceToGrid = (gameState: GameState): GameState => {
	let GS = Object.assign({}, gameState);
	relativePos(GS.piece)(GS.pos).forEach(element => {
		GS.board[Math.trunc(element.y)][Math.trunc(element.x)] = GS.piece.id;
	});
	return GS;
};
