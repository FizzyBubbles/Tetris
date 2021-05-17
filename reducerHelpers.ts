import { Transformation, GameState, Piece } from "./types";

import { multiply, add, subtract, rotate, cis } from "./complex";
import { numFullRows, addPieceToGrid, clearFullRows } from "./collision";
import { randomPiece, randomBag } from "./random";
import { calculateLevel, calculateScore } from "./scoring";
import { STARTINGPOS, PIECE } from "./constants";

// key press handling
export const rotateClockwise: Transformation = multiply({ x: 0, y: 1 });
export const rotateAntiClockwise: Transformation = multiply({ x: 0, y: -1 });
export const rotate180: Transformation = multiply({ x: -1, y: 0 });
export const down: Transformation = add({ x: 0, y: 1 });
export const left: Transformation = add({ x: -1, y: 0 });
export const right: Transformation = add({ x: 1, y: 0 });

export const moveLeft = (state: GameState): GameState => ({
	...state,
	pos: left(state.pos)
}); // TODO: make sure this isn't an unnecessary abstraction
export const moveRight = (state: GameState): GameState => ({
	...state,
	pos: right(state.pos)
}); // TODO: make sure this isn't an unnecessary abstraction
export const rotatePieceClockwise = (piece: Piece): Piece => ({
	...updatePiece(piece)(rotateClockwise),
	rotationState: (piece.rotationState + 1) % 4
});
export const rotatePieceAntiClockwise = (piece: Piece): Piece => ({
	...updatePiece(piece)(rotateAntiClockwise),
	rotationState: (piece.rotationState + 3) % 4
});
export const rotatePiece180 = (piece: Piece): Piece => ({
	...updatePiece(piece)(rotate180),
	rotationState: (piece.rotationState + 2) % 4
});

export const updatePiece = (piece: Piece) => (
	transformation: Transformation
): Piece => ({
	...piece,
	shape: piece.shape.map(transformation)
});

export const resetPieceRotation = (piece: Piece): Piece => {
	let basePiece = piece;
	switch (piece.rotationState) {
		case 0:
			basePiece = piece;
			break;
		case 1:
			basePiece = rotatePieceAntiClockwise(piece);
			break;
		case 2:
			basePiece = rotatePiece180(piece);
			break;
		case 3:
			basePiece = rotatePieceClockwise(piece);
			break;
	}
	console.log(basePiece);
	return basePiece;
};

export const settlePiece = (state: GameState): GameState => {
	const numLinesCleared = numFullRows(addPieceToGrid(state).board);
	const nextPiece = state.queue[0];
	// console.log("nextPiece: ", nextPiece.name);
	// console.log(
	// 	"queue initial: ",
	// 	state.queue.map(e => e.name)
	// );
	const nextState = {
		...state,
		queue:
			state.queue.length <= 7
				? [...state.queue.slice(1), ...randomBag()]
				: state.queue.slice(1),
		cummulativeLineClears: state.cummulativeLineClears + numLinesCleared,
		level: calculateLevel(state.cummulativeLineClears),
		score: state.score + calculateScore(numLinesCleared)(state.level),
		board: clearFullRows(addPieceToGrid(state).board),
		pos: add(nextPiece.rotationalCentre)(STARTINGPOS),
		piece: {
			...nextPiece,
			shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre))
		}
	};

	// console.log(
	// 	"queue next: ",
	// 	nextState.queue.map(e => e.name)
	// );
	// console.log("Current Score: ", nextState.score);
	// console.log("Current Level: ", nextState.level);
	// console.log(
	// 	"Cummulative Line Clears: ",
	// 	nextState.cummulativeLineClears
	// );
	return nextState;
};
