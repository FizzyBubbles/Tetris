import { Transformation, GameState } from "./types";

import { multiply, add, subtract, rotate, cis } from "./complex";
import { numFullRows, addPieceToGrid, clearFullRows } from "./collision";
import { randomPiece, randomBag } from "./random";
import { calculateLevel, calculateScore } from "./scoring";
import { STARTINGPOS } from "./constants";

// key press handling
export const rotateClockwise: Transformation = multiply({ x: 0, y: 1 });
export const rotateAntiClockwise: Transformation = multiply({ x: 0, y: -1 });
export const rotate180: Transformation = multiply({ x: -1, y: 0 });
export const down: Transformation = add({ x: 0, y: 1 });
export const left: Transformation = add({ x: -1, y: 0 });
export const right: Transformation = add({ x: 1, y: 0 });

export const settlePiece = (state: GameState): GameState => {
	const numLinesCleared = numFullRows(addPieceToGrid(state).board);
	const nextPiece = state.queue[0];
	// console.log("nextPiece: ", nextPiece.name);
	// console.log(
	// 	"queue initial: ",
	// 	state.queue.map(e => e.name)
	// );
	const nextState = {
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
