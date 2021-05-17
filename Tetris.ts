import { cloneDeep } from "lodash";
import {
	PIECES,
	CELL,
	COLOURSCHEME,
	PIECE,
	KeyBindings,
	STARTINGPOS,
	NewGameState
} from "./constants";
import { add, multiply, cis, rotate, ID, subtract } from "./complex";
import {
	Complex,
	Piece,
	Input,
	Transformation,
	GameBoard,
	GameState
} from "./types";
import {
	drawSquareGameBoard,
	drawPieceGameBoard,
	gameBoardContext,
	gameCanvas,
	drawGrid,
	draw,
	drawPieceQueue,
	clearQueue
} from "./drawUtils";
import {
	pieceCollided,
	addPieceToGrid,
	fullRows,
	clearLine,
	clearFullRows,
	emptyRow,
	newGameBoard,
	numFullRows,
	failed,
	wallKick,
	hardDrop
} from "./collision";
import { stat } from "fs";
import { calculateLevel, calculateScore } from "./scoring";
import { statement } from "@babel/template";
import { randomPiece, randomBag } from "./random";
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
	rotatePieceClockwise
} from "./reducerHelpers";
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
		paused: false
	});
};

type GameAction =
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
		case "MOVE-LEFT": {
			if (state.paused) return state; // returns state if paused
			const newState = moveLeft(state);
			return pieceCollided(newState) ? state : newState;
		}

		case "MOVE-RIGHT": {
			if (state.paused) return state; // returns state if paused
			const newState = moveRight(state);
			return pieceCollided(newState) ? state : newState;
		}

		case "SOFT-DROP": {
			if (state.paused) return state; // returns state if paused
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				if (failed(newState)) {
					return resetGameState();
				}
				return settlePiece(state);
			}
			return newState;
		}

		case "HARD-DROP": {
			if (state.paused) return state; // returns state if paused
			const newState = hardDrop(state);
			if (failed(newState)) {
				return resetGameState();
			}
			return settlePiece(newState);
		}

		case "ROTATE-ANTICLOCKWISE": {
			if (state.paused) return state; // returns state if paused
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
			if (state.paused) return state; // returns state if paused
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
			return { ...state, paused: !state.paused };

		case "CLOCK-TICK": {
			if (state.paused) return state;
			const newState = { ...state, pos: down(state.pos), tick: 0 };
			if (
				state.tick >=
				10 * Math.pow(0.8 - (state.level - 1) * 0.007, state.level - 1) // speed calculation
			) {
				if (pieceCollided(newState)) {
					if (failed(newState)) {
						return resetGameState();
					}
					return { ...settlePiece(state), tick: 0 };
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

const makeStore = <State, Action>(
	reducer: (state: State, action: Action) => State,
	initialState: State
): {
	state: State;
	dispatch: (action: Action) => void;
	subscribe: (listener: (state: State) => void) => void;
} => {
	let state = initialState;
	let listeners: ((state: State) => void)[] = [];

	const subscribe = (listener: (state: State) => void) => {
		listeners = [...listeners, listener];
	};
	const dispatch = (action: Action) => {
		// console.log("dispatched action", action);
		const newState = reducer(state, action);
		state = newState;
		listeners.forEach(listener => listener(state));
	};

	return { state, dispatch, subscribe };
};

const tetrisStore = makeStore(tetrisReducer, resetGameState());

const main = () => {
	const drawState = (tetrisState: GameState) => {
		draw(tetrisState);
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
		clearQueue(COLOURSCHEME[0]);
		gameState.queue.forEach((p, i) =>
			drawPieceQueue(p)({ x: 1, y: i * 3 + 2 })
		);
	};

	tetrisStore.subscribe(writeScore);
	tetrisStore.subscribe(writeLevel);
	tetrisStore.subscribe(writeLinesCleared);
	tetrisStore.subscribe(drawState);
	tetrisStore.subscribe(drawQueue);
};

const loop = (timestamp: number) => {
	tetrisStore.dispatch("CLOCK-TICK");
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

document.onkeydown = e => {
	switch (e.which) {
		case KeyBindings.left:
			tetrisStore.dispatch("MOVE-LEFT");
			break;

		case KeyBindings.right:
			tetrisStore.dispatch("MOVE-RIGHT");
			break;

		case KeyBindings.rotateClockwise:
			tetrisStore.dispatch("ROTATE-CLOCKWISE");
			break;

		case KeyBindings.rotateAntiClockwise:
			tetrisStore.dispatch("ROTATE-ANTICLOCKWISE");
			break;

		case KeyBindings.softDrop:
			tetrisStore.dispatch("SOFT-DROP");
			break;

		case KeyBindings.hardDrop:
			tetrisStore.dispatch("HARD-DROP");
			break;

		case KeyBindings.hold:
			tetrisStore.dispatch("PAUSE");
			break;

		case KeyBindings.reset:
			tetrisStore.dispatch("RESET");
			break;
	}
};

main();
