import { Transformation, GameState, Piece, RotationState } from "./types";

import { multiply, add, subtract } from "./complex";
import { numFullRows, addPieceToGrid, clearFullRows } from "./collision";
import { random7Bag } from "./random";
import { calculateLevel, calculateScore } from "./scoring";
import { STARTINGPOS } from "./constants";

// key press handling
// Mathematical transformations for vectors
export const rotateClockwise: Transformation = multiply({ x: 0, y: 1 });
export const rotateAntiClockwise: Transformation = multiply({ x: 0, y: -1 });
export const rotate180: Transformation = multiply({ x: -1, y: 0 });
export const down: Transformation = add({ x: 0, y: 1 });
export const left: Transformation = add({ x: -1, y: 0 });
export const right: Transformation = add({ x: 1, y: 0 });

export const rotatePieceClockwise = (piece: Piece): Piece => ({
	...piece,
	shape: piece.shape.map(rotateClockwise),
	rotationState: (piece.rotationState + 1) % 4 // updates piece rotation state
});
export const rotatePieceAntiClockwise = (piece: Piece): Piece => ({
	...piece,
	shape: piece.shape.map(rotateAntiClockwise),
	rotationState: (piece.rotationState + 3) % 4 // updates piece rotation state
});

export const rotatePiece180 = (piece: Piece): Piece => ({
	...piece,
	shape: piece.shape.map(rotate180),
	rotationState: (piece.rotationState + 2) % 4 // updates piece rotation state
});

export const resetPieceRotation = (piece: Piece): Piece => {
	let basePiece = piece; // if rotation state of piece is North it will return itself
	switch (piece.rotationState) {
		// rotates anticlockwise back to North
		case RotationState.East:
			basePiece = rotatePieceAntiClockwise(piece);
			break;

		// rotates 180 back to North
		case RotationState.South:
			basePiece = rotatePiece180(piece);
			break;

		// rotates clockwise back to North
		case RotationState.West:
			basePiece = rotatePieceClockwise(piece);
			break;
	}
	return basePiece;
};

// routine for adding a piece to grid and cycling to the next piece
export const settlePiece = (state: GameState): GameState => {
	const numLinesCleared = numFullRows(addPieceToGrid(state).board);
	const nextPiece = state.queue[0];

	const nextState = {
		...state,
		// makes sure the queue is stocked at all times
		queue:
			state.queue.length <= 7
				? [...state.queue.slice(1), ...random7Bag()]
				: state.queue.slice(1),
		cummulativeLineClears: state.cummulativeLineClears + numLinesCleared, // increases the line clears
		level: calculateLevel(state.cummulativeLineClears), // updates the level
		score: state.score + calculateScore(numLinesCleared)(state.level), // increases the score
		board: clearFullRows(addPieceToGrid(state).board), // removes the full rows
		pos: add(nextPiece.rotationalCentre)(STARTINGPOS), // adjusts the piece position
		piece: {
			...nextPiece,
			shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre)) // adjusts piece position for shape
		}
	};

	return nextState;
};
