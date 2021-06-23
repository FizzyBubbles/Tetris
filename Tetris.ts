import { makeStore } from "./tetris_modules/reduxSystem";
import { STARTINGPOS, resetGameState } from "./tetris_modules/constants";
import { add, subtract } from "./tetris_modules/complex";
import { GameState } from "./tetris_modules/types";
import {
	pieceCollided,
	failed,
	calculateWallKickPosition as calculateWallKickDisplacement,
	hardDrop
} from "./tetris_modules/collision";
import {
	down,
	settlePiece,
	rotatePieceAntiClockwise,
	rotatePieceClockwise,
	resetPieceRotation,
	left,
	right
} from "./tetris_modules/reducerHelpers";
import { calculateSpeed } from "./tetris_modules/scoring";
import {
	writeHighScore,
	writeScore,
	writeLevel,
	writeLinesCleared,
	drawState,
	drawQueue,
	drawHold,
	drawFail,
	drawGhost
} from "./tetris_modules/tetrisListeners";
import { keydown, keyup } from "./tetris_modules/keyhandling";
import { FAILSCREENMESSAGES } from "./tetris_modules/SETTINGS";
import { randomMessage } from "./tetris_modules/random";

// all possible edits to the game state (GameActions)
type GameAction =
	| "HOLD"
	| "MOVE-LEFT"
	| "MOVE-RIGHT"
	| "SOFT-DROP"
	| "HARD-DROP"
	| "ROTATE-CLOCKWISE"
	| "ROTATE-ANTICLOCKWISE"
	| "PAUSE"
	| "CLOCK-TICK"
	| "RESET"
	| "EXIT-FAIL";

const tetrisReducer = (state: GameState, action: GameAction): GameState => {
	switch (action) {
		case "HOLD": {
			if (!state.holdFresh || state.paused || state.fail) return state; // returns state if failed, or paused, or the piece has been in hold before

			// sets the next hold piece and adjusts it back to the correct orientation
			const nextHold = {
				...resetPieceRotation(state.piece),
				shape: resetPieceRotation(state.piece).shape.map(
					add(state.piece.rotationalCentre)
				)
			};

			// if the hold is empty it will take the next piece from the queue as opposed to the hold itself
			if (state.holdPiece == "empty") {
				const nextPiece = state.queue[0]; // takes first piece from queue
				const nextQueue = state.queue.slice(1); // removes element from queue
				const nextState = {
					...state,
					pos: add(nextPiece.rotationalCentre)(STARTINGPOS), // adjusts the piece position
					holdPiece: nextHold, // sets the hold piece
					queue: nextQueue, // sets the next queue
					piece: {
						...nextPiece,
						shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre)) // adjusts the piece shape
					},
					holdFresh: false // unfreshens the hold
				};
				return nextState;
			} else {
				const nextPiece = state.holdPiece; // sets the next piece as the current hold piece
				const nextState = {
					...state,
					pos: add(nextPiece.rotationalCentre)(STARTINGPOS), // adjusts the piece position
					holdPiece: nextHold, // sets the hold piece
					piece: {
						...nextPiece,
						shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre)) // adjustst the piece shape
					},
					holdFresh: false // unfreshens the hold
				};
				return nextState;
			}
		}
		case "MOVE-LEFT": {
			if (state.paused || state.fail) return state; // returns state if paused or failed
			const newState = { ...state, pos: left(state.pos) };
			return pieceCollided(newState) ? state : newState;
		}

		case "MOVE-RIGHT": {
			if (state.paused || state.fail) return state; // returns state if paused or failed
			const newState = { ...state, pos: right(state.pos) };
			return pieceCollided(newState) ? state : newState;
		}

		case "SOFT-DROP": {
			if (state.paused || state.fail) return state; // returns state if paused or failed
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				return state;
			}
			return newState;
		}

		case "HARD-DROP": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = hardDrop(state);
			if (failed(newState)) {
				return { ...newState, fail: true };
			}
			return { ...settlePiece(newState), holdFresh: true };
		}

		case "ROTATE-ANTICLOCKWISE": {
			if (state.paused || state.fail) return state; // returns state if paused or failed
			const newState = {
				...state,
				piece: rotatePieceAntiClockwise(state.piece)
			};

			// wallKick returns the displacement a piece has based on some tests or null if it fails all tests
			const wallKickDisplacement = calculateWallKickDisplacement(newState)(
				state.piece.rotationState
			);

			// if no wall kick tests were passed (null) it will not perform the rotation else it will displace the newState by the wallkick
			return wallKickDisplacement == null
				? state
				: { ...newState, pos: add(wallKickDisplacement)(newState.pos) };
		}

		case "ROTATE-CLOCKWISE": {
			if (state.paused || state.fail) return state; // returns state if paused or failed
			const newState = {
				...state,
				piece: rotatePieceClockwise(state.piece)
			};

			// wallKick returns the displacement a piece has based on some tests or null if it fails all tests
			const wallKickDisplacement = calculateWallKickDisplacement(newState)(
				state.piece.rotationState
			);

			// if no wall kick tests were passed (null) it will not perform the rotation else it will displace the newState by the wallkick
			return wallKickDisplacement == null
				? state
				: { ...newState, pos: add(wallKickDisplacement)(newState.pos) };
		}

		case "PAUSE":
			return state.fail ? state : { ...state, paused: !state.paused }; // toggles pause if not failed

		case "CLOCK-TICK": {
			if (state.paused) return state; // returns state if paused

			if (state.fail) {
				// changes the message for fail screen every 100 ticks
				return state.tick >= 100
					? {
							...state,
							tick: 0, // resets tick timer
							failMessage: randomMessage() // changes the fail screen message to a random message from the FAILSCREENMESSAGES array
					  }
					: { ...state, tick: state.tick + 1 }; // otherwise increases the tick
			}

			const newState = {
				...state,
				pos: down(state.pos),
				tick: 0 // resets the tick
			};
			if (state.tick >= calculateSpeed(state.level)) {
				if (pieceCollided(newState)) {
					// collision procedure
					if (failed(newState)) {
						return { ...newState, fail: true };
					}
					return { ...settlePiece(state), tick: 0, holdFresh: true }; // refreshens
				}
				return newState;
			}
			return { ...state, tick: state.tick + 1 };
		}

		case "RESET": {
			return state.score > state.highScore
				? resetGameState(state.score) // if new highscore the game will keep that high score
				: resetGameState(state.highScore); // if not it remains the same;
		}
		case "EXIT-FAIL": {
			return state.fail
				? state.score > state.highScore
					? resetGameState(state.score) // if new highscore the game will keep that high score
					: resetGameState(state.highScore) // if not it remains the same
				: state;
		}
	}
};

export const tetrisStore = makeStore(tetrisReducer, resetGameState(0)); // makes the initial store

const main = () => {
	// adds all the listeners
	tetrisStore.subscribe(writeHighScore);
	tetrisStore.subscribe(writeScore);
	tetrisStore.subscribe(writeLevel);
	tetrisStore.subscribe(writeLinesCleared);
	tetrisStore.subscribe(drawState);
	tetrisStore.subscribe(drawQueue);
	tetrisStore.subscribe(drawHold);
	tetrisStore.subscribe(drawFail);
	tetrisStore.subscribe(drawGhost);
};

const loop = () => {
	tetrisStore.dispatch("CLOCK-TICK"); // calls "clock-tick"
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

keydown;
keyup;

main();
