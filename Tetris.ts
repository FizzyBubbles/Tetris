import { cloneDeep } from "lodash";
import { makeStore } from "./tetris_modules/reduxSystem";
import {
	PIECES,
	CELL,
	NewGameState,
	KEYBINDINGS,,
	STARTINGPOS
	COLOURSCHEME
} from "./tetris_modules/constants";
import {
	add,
	multiply,
	cis,
	rotate,
	ID,
	subtract
} from "./tetris_modules/complex";
import {
	Complex,
	Piece,
	Input,
	Transformation,
	GameBoard,
	GameState
} from "./tetris_modules/types";
import {
	drawSquareGameBoard,
	drawPieceGameBoard,
	gameBoardContext,
	gameCanvas,
	drawGrid,
	draw,
	drawPieceQueue,
	fillQueue,
	fillHold,
	drawPieceHold,
	holdCanvas,
	drawFailScreen
} from "./tetris_modules/drawUtils";
import {
	pieceCollided,
	addPieceToGrid,
	fullRows,
	newGameBoard,
	numFullRows,
	failed,
	wallKick,
	hardDrop
} from "./tetris_modules/collision";
import { stat } from "fs";
import { calculateLevel, calculateScore } from "./tetris_modules/scoring";
import { statement } from "@babel/template";
import { randomPiece, randomBag } from "./tetris_modules/random";
import {
	left,
	right,
	down,
	rotateAntiClockwise,
	rotateClockwise,
	settlePiece,
	moveLeft,
	moveRight,
	rotatePieceAntiClockwise,
	rotatePieceClockwise,
	resetPieceRotation
} from "./tetris_modules/reducerHelpers";
import { ConsoleWriter } from "istanbul-lib-report";

const resetGameState = (): GameState => {
	const firstPiece = randomPiece();
	return cloneDeep({
		queue: randomBag(),
		cummulativeLineClears: 0,
		level: 0,
		score: 0,
		piece: {
			...firstPiece,
			shape: firstPiece.shape.map(subtract(firstPiece.rotationalCentre))
		},
		pos: add(firstPiece.rotationalCentre)(STARTINGPOS),
		board: newGameBoard(10)(20),
		tick: 0,
		paused: false,
		holdPiece: "empty",
		holdFresh: true,
		fail: false
	});
};

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
	| "RESET";

const tetrisReducer = (state: GameState, action: GameAction): GameState => {
	switch (action) {
		case "HOLD": {
			// TODO: figure out what the fuck you are doing here

			if (!state.holdFresh || state.paused || state.fail) return state;

			const nextHold = {
				...resetPieceRotation(state.piece),
				shape: resetPieceRotation(state.piece).shape.map(
					add(state.piece.rotationalCentre)
				)
			};

			if (state.holdPiece == "empty") {
				const nextPiece = state.queue[0];
				const nextQueue = state.queue.slice(1);
				const nextState = {
					...state,
					pos: add(nextPiece.rotationalCentre)(STARTINGPOS),
					holdPiece: nextHold,
					queue: nextQueue,
					piece: {
						...nextPiece,
						shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre))
					},
					holdFresh: false
				};
				return nextState;
			} else {
				const nextPiece = state.holdPiece;
				const nextState = {
					...state,
					pos: add(nextPiece.rotationalCentre)(STARTINGPOS),
					holdPiece: nextHold,
					piece: {
						...nextPiece,
						shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre))
					},
					holdFresh: false
				};
				return nextState;
			}
		}
		case "MOVE-LEFT": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = moveLeft(state);
			return pieceCollided(newState) ? state : newState;
		}

		case "MOVE-RIGHT": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = moveRight(state);
			return pieceCollided(newState) ? state : newState;
		}

		case "SOFT-DROP": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				if (failed(newState)) {
					return resetGameState();
				}
				return { ...settlePiece(state), holdFresh: true };
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
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = {
				...state,
				piece: rotatePieceAntiClockwise(state.piece)
			};

			// wallKick returns the displacement a piece has based on some tests or null if it fails all tests
			const WallKick = wallKick(newState)(state.piece.rotationState);

			// if no wall kick tests were passed (null) it will not perform the rotation else it will displace the newState by the wallkick
			return WallKick == null
				? state
				: { ...newState, pos: add(WallKick)(newState.pos) };
		}

		case "ROTATE-CLOCKWISE": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = {
				...state,
				piece: rotatePieceClockwise(state.piece)
			};

			// wallKick returns the displacement a piece has based on some tests or null if it fails all tests
			const WallKick = wallKick(newState)(state.piece.rotationState);

			// if no wall kick tests were passed (null) it will not perform the rotation else it will displace the newState by the wallkick
			return WallKick == null
				? state
				: { ...newState, pos: add(WallKick)(newState.pos) };
		}

		case "PAUSE":
			return state.fail ? state : { ...state, paused: !state.paused };

		case "CLOCK-TICK": {
			if (state.paused || state.fail) return state;
			const newState = { ...state, pos: down(state.pos), tick: 0 };
			if (
				state.tick >=
				10 * Math.pow(0.8 - (state.level - 1) * 0.007, state.level - 1) // speed calculation
			) {
				if (pieceCollided(newState)) {
					if (failed(newState)) {
						return { ...newState, fail: true };
					}
					return { ...settlePiece(state), tick: 0, holdFresh: true };
				}
				return newState;
			}
			return { ...state, tick: state.tick + 1 };
		}

		case "RESET": {
			return resetGameState();
		}
	}
};

const tetrisStore = makeStore(tetrisReducer, resetGameState());

const main = () => {
	// listeners
	const drawState = (tetrisState: GameState) => {
		draw(tetrisState); // draws the board
	};
	const writeScore = (gameState: GameState): void => {
		document.getElementById("score").innerHTML = "Score: " + gameState.score;
	};
	const writeLevel = (gameState: GameState): void => {
		document.getElementById("level").innerHTML = "Level: " + gameState.level;
	};
	const writeLinesCleared = (gameState: GameState): void => {
		document.getElementById("linesCleared").innerHTML =
			"Lines Cleared: " + gameState.cummulativeLineClears;
	};
	const drawQueue = (gameState: GameState): void => {
		fillQueue(COLOURSCHEME[0]);
		gameState.queue.forEach((piece, queuePlacement) =>
			drawPieceQueue(piece)({ x: 1, y: queuePlacement * 3 + 2 })
		);
	};
	const drawHold = (gameState: GameState): void => {
		fillHold(COLOURSCHEME[0]);
		if (gameState.holdPiece != "empty") {
			drawPieceHold(gameState.holdPiece)({ x: 1, y: 2 });
		}
	};
	const drawFail = (gameState: GameState): void => {
		drawFailScreen(gameState);
	};

	tetrisStore.subscribe(writeScore);
	tetrisStore.subscribe(writeLevel);
	tetrisStore.subscribe(writeLinesCleared);
	tetrisStore.subscribe(drawState);
	tetrisStore.subscribe(drawQueue);
	tetrisStore.subscribe(drawHold);
	tetrisStore.subscribe(drawFail);
};

const loop = (timestamp: number) => {
	tetrisStore.dispatch("CLOCK-TICK");
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

document.onkeydown = e => {
	switch (e.which) {
		case KEYBINDINGS.left:
			tetrisStore.dispatch("MOVE-LEFT");
			break;

		case KEYBINDINGS.right:
			tetrisStore.dispatch("MOVE-RIGHT");
			break;

		case KEYBINDINGS.rotateClockwise1:
			tetrisStore.dispatch("ROTATE-CLOCKWISE");
			break;

		case KEYBINDINGS.rotateClockwise2:
			tetrisStore.dispatch("ROTATE-CLOCKWISE");
			break;

		case KEYBINDINGS.rotateAntiClockwise:
			tetrisStore.dispatch("ROTATE-ANTICLOCKWISE");
			break;

		case KEYBINDINGS.softDrop:
			tetrisStore.dispatch("SOFT-DROP");
			break;

		case KEYBINDINGS.hardDrop:
			tetrisStore.dispatch("HARD-DROP");
			break;

		case KEYBINDINGS.hold:
			tetrisStore.dispatch("HOLD");
			break;

		case KEYBINDINGS.reset:
			tetrisStore.dispatch("RESET");
			break;

		case KEYBINDINGS.pause1:
			tetrisStore.dispatch("PAUSE");
			break;

		case KEYBINDINGS.pause2:
			tetrisStore.dispatch("PAUSE");
			break;
	}
};

main();
