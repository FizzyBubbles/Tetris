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
	settlePiece
} from "./reducerHelpers";

const resetGameState = (): GameState =>
	cloneDeep({
		queue: randomBag(),
		cummulativeLineClears: 10,
		level: 0,
		score: 0,
		piece: randomPiece(),
		pos: STARTINGPOS,
		board: newGameBoard(10)(20)
	});

var go = true;

type GameAction =
	| "MOVE-LEFT"
	| "MOVE-RIGHT"
	| "SOFT-DROP"
	| "HARD-DROP"
	| "ROTATE-CLOCKWISE"
	| "ROTATE-ANTICLOCKWISE"
	| "CLOCK-TICK"
	| "RESET";

const tetrisReducer = (state: GameState, action: GameAction): GameState => {
	switch (action) {
		case "MOVE-LEFT": {
			const newState = { ...state, pos: left(state.pos) };
			return pieceCollided(newState) ? state : newState;
		}

		case "MOVE-RIGHT": {
			const newState = { ...state, pos: right(state.pos) };
			return pieceCollided(newState) ? state : newState;
		}

		case "SOFT-DROP": {
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				if (failed(state)) {
					return resetGameState();
				}
				return settlePiece(state);
			}
			return newState;
		}
		case "HARD-DROP": {
			return hardDrop(state);
		}
		case "ROTATE-ANTICLOCKWISE": {
			const newState = {
				...state,
				piece: {
					...updatePiece(state.piece)(rotateAntiClockwise),
					rotationState: (state.piece.rotationState + 3) % 4
				}
			};
			const WallKick = wallKick(newState)(state.piece.rotationState);
			return WallKick == null
				? state
				: { ...newState, pos: add(WallKick)(newState.pos) };
		}

		case "ROTATE-CLOCKWISE": {
			const newState = {
				...state,
				piece: {
					...updatePiece(state.piece)(rotateClockwise),
					rotationState: (state.piece.rotationState + 1) % 4
				}
			};
			console.log(
				"ClockWise from" +
					state.piece.rotationState +
					" to " +
					newState.piece.rotationState
			);
			const WallKick = wallKick(newState)(state.piece.rotationState);
			return WallKick == null
				? state
				: { ...newState, pos: add(WallKick)(newState.pos) };
		}

		case "CLOCK-TICK": {
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				if (failed(state)) {
					return resetGameState();
				}
				return settlePiece(state);
			}
			return newState;
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

export const updatePiece = (piece: Piece) => (
	transformation: Transformation
): Piece => ({
	...piece,
	shape: piece.shape.map(transformation)
});

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

var oop = 0;

const loop = (timestamp: number) => {
	oop = oop + 1;
	if (oop >= 10 && go) {
		tetrisStore.dispatch("CLOCK-TICK");
		oop = 0;
	}
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
			go = !go;
			break;
		case KeyBindings.reset:
			tetrisStore.dispatch("RESET");
			break;
	}
};

main();

// updates GameState
// const update = (input: Input) => (gameState: GameState): void => {
// 	//console.log(updatePiece(gameState.piece)(input.rotation), gameState);
// 	// let GS: GameState = Object.assign({}, gameState); // temporarily stores the next game state.

// 	let GS: GameState = cloneDeep(gameState); // temporarily stores the next game state.
// 	GS.piece = updatePiece(gameState.piece)(input.rotation);
// 	GS.pos = input.translation(gameState.pos);
// 	if (collisionDetection(GS)) {
// 		GS = Object.assign({}, addPieceToGrid(gameState));

// 		const randPiece: Piece =
// 			PIECE[pieces[Math.floor(Math.random() * pieces.length)]];

// 		gameState.piece = {
// 			shape: randPiece.shape.map(add({ x: -1.5, y: -1.5 })),
// 			id: randPiece.id,
// 			colour: randPiece.colour
// 		};

// 		gameState.pos = { x: 3.5, y: 0.5 };
// 		console.log(GS, gameState);
// 	} else {
// 		gameState = Object.assign({}, GS);
// 	}
// 	GAMESTATE = gameState;
// 	draw(gameState);
// };
