import { cloneDeep } from "lodash";
import {
	pieces,
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
	GameState,
	Input,
	Transformation,
	GameBoard
} from "./types";
import { drawSquare, drawPiece, c, CANVAS, drawGrid } from "./drawUtils";
import {
	pieceCollided,
	addPieceToGrid,
	fullRows,
	clearLine,
	clearFullRows,
	emptyRow,
	newGameBoard,
	numFullRows,
	failed
} from "./collision";
import { stat } from "fs";
import { calculateLevel, calculateScore } from "./scoring";

const resetGameState = (): GameState => cloneDeep(NewGameState);

const randomPiece = (): Piece =>
	PIECE[pieces[Math.trunc(Math.random() * pieces.length)]];

// key press handling
const rotateClockwise: Transformation = multiply({ x: 0, y: 1 }); // TODO: fix
const rotateAntiClockwise: Transformation = multiply({ x: 0, y: -1 }); // TODO: fix
const down: Transformation = add({ x: 0, y: 1 });
const left: Transformation = add({ x: -1, y: 0 });
const right: Transformation = add({ x: 1, y: 0 });

var go = true;

type GameAction =
	| "MOVE-LEFT"
	| "MOVE-RIGHT"
	| "MOVE-DOWN"
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
		case "MOVE-DOWN": {
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				const numLinesCleared = numFullRows(addPieceToGrid(state).board);
				const nextState = {
					cummulativeLineClears: state.cummulativeLineClears + numLinesCleared,
					level: calculateLevel(state.cummulativeLineClears),
					score: state.score + calculateScore(numLinesCleared)(state.level),
					board: clearFullRows(addPieceToGrid(state).board),
					pos: STARTINGPOS,
					piece: randomPiece()
				};
				console.log("Current Score: ", nextState.score);
				console.log("Current Level: ", nextState.level);
				console.log(
					"Cummulative Line Clears: ",
					nextState.cummulativeLineClears
				);
				return nextState;
			}
			return newState;
			//return collisionDetection(newState) ? addPieceToGrid(state) : newState;}
		}
		case "ROTATE-ANTICLOCKWISE": {
			const newState = {
				...state,
				piece: updatePiece(state.piece)(rotateAntiClockwise)
			};
			return pieceCollided(newState) ? state : newState;
		}
		case "ROTATE-CLOCKWISE": {
			const newState = {
				...state,
				piece: updatePiece(state.piece)(rotateClockwise)
			};
			return pieceCollided(newState) ? state : newState;
		}
		case "CLOCK-TICK": {
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				if (failed(state)) {
					return resetGameState();
				}
				const numLinesCleared = numFullRows(addPieceToGrid(state).board);
				const nextPiece = randomPiece();
				const nextState = {
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
				console.log("Current Score: ", nextState.score);
				console.log("Current Level: ", nextState.level);
				console.log(
					"Cummulative Line Clears: ",
					nextState.cummulativeLineClears
				);
				console.log(NewGameState);
				return nextState;
			}
			return newState;
			//return collisionDetection(newState) ? addPieceToGrid(state) : newState;
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

const updatePiece = (piece: Piece) => (
	transformation: Transformation
): Piece => ({
	...piece,
	shape: piece.shape.map(transformation)
});

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

const main = () => {
	const drawState = (tetrisState: GameState) => {
		draw(tetrisState);
	};
	// tetrisSubscribe(drawState);
	tetrisStore.subscribe(drawState);
	// tetrisSubscribe(tetrisState => {
	// 	console.log("subscribe", tetrisState);
	// 	draw(tetrisState);
	// });
};

// handles drawing on the canvas
const draw = (gameState: GameState): void => {
	drawGrid(gameState.board);
	drawPiece(gameState.piece)(gameState.pos);
};

var oop = 0;

const loop = (timestamp: number) => {
	oop = oop + 1;
	if (oop >= 10 && go) {
		// update({ rotation: ID, translation: down })(
		// 	Object.assign({}, Object.assign({}, GAMESTATE))
		// );
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
			tetrisStore.dispatch("MOVE-DOWN");
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
