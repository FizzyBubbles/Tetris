import { cloneDeep } from "lodash";
import {
	pieces,
	CELL,
	COLOURSCHEME,
	PIECE,
	KeyBindings,
	STARTINGPOS
} from "./constants";
import { add, multiply, cis, rotate, ID } from "./complex";
import {
	Complex,
	Piece,
	GameState,
	Input,
	Transformation,
	GameBoard
} from "./types";
import { drawSquare, drawPiece, c, CANVAS } from "./drawUtils";
import { collisionDetection, addPieceToGrid } from "./collision";

// returns a game board of specified size with each value being an empty cell
const newGameBoard = (rows: number) => (columns: number): GameBoard => {
	let constructedBoard: GameBoard = [];
	for (let col = 0; col < columns; col++) {
		// loops through the columns and pushes the rows of empty cells into the 2d array game board
		let constructedRow = [];
		for (let row = 0; row < rows; row++) {
			// creates rows of empty cells at a specified length
			constructedRow.push(CELL.EMPTY);
		}
		// pushes the constructed row into the game board
		constructedBoard.push(constructedRow);
	}
	return constructedBoard;
};

// whole game state
var GAMESTATE: GameState = {
	piece: PIECE.L_PIECE,
	pos: { x: 3.5, y: 1.5 },
	board: newGameBoard(10)(20)
};
GAMESTATE.board[19] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

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
	| "CLOCK-TICK";

const tetrisReducer = (state: GameState, action: GameAction): GameState => {
	switch (action) {
		case "MOVE-LEFT":
			return {
				...state,
				pos: left(state.pos)
			};
		case "MOVE-RIGHT":
			return {
				...state,
				pos: right(state.pos)
			};
		case "MOVE-DOWN": {
			const newState = { ...state, pos: down(state.pos) };
			return collisionDetection(newState) ? addPieceToGrid(state) : newState;
		}
		case "ROTATE-ANTICLOCKWISE":
			return {
				...state,
				piece: updatePiece(state.piece)(rotateAntiClockwise)
			};
		case "ROTATE-CLOCKWISE":
			return {
				...state,
				piece: updatePiece(state.piece)(rotateClockwise)
			};
		case "CLOCK-TICK": {
			const newState = { ...state, pos: down(state.pos) };
			if (collisionDetection(newState)) {
				return {
					...addPieceToGrid(state),
					pos: STARTINGPOS,
					piece: randomPiece()
				};
			}
			return newState;
			//return collisionDetection(newState) ? addPieceToGrid(state) : newState;
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

const tetrisStore = makeStore(tetrisReducer, GAMESTATE);

const updatePiece = (piece: Piece) => (
	transformation: Transformation
): Piece => ({
	id: piece.id,
	colour: piece.colour,
	shape: piece.shape.map(transformation)
});

const drawGrid = (grid: GameBoard): void => {
	// goes through each element of the grid and draws the respective cell.
	grid.forEach((
		row,
		i // for each row
	) =>
		row.forEach((cell, j) => {
			// for each cell within the row
			// console.log(cell);
			drawSquare(COLOURSCHEME[cell])({ x: j, y: i });
		})
	);
};

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
			// update({ rotation: ID, translation: left })(Object.assign({}, GAMESTATE));
			tetrisStore.dispatch("MOVE-LEFT");
			break;
		case KeyBindings.right:
			// update({ rotation: ID, translation: right })(
			// Object.assign({}, GAMESTATE)
			// );
			tetrisStore.dispatch("MOVE-RIGHT");
			break;
		case KeyBindings.rotateClockwise:
			// update({ rotation: rotateClockwise, translation: ID })(
			// Object.assign({}, GAMESTATE)
			// );
			tetrisStore.dispatch("ROTATE-CLOCKWISE");
			break;
		case KeyBindings.rotateAntiClockwise:
			// update({ rotation: rotateAntiClockwise, translation: ID })(
			// Object.assign({}, GAMESTATE)
			// );
			tetrisStore.dispatch("ROTATE-ANTICLOCKWISE");
			break;
		case KeyBindings.hold:
			go = !go;
			break;
	}
};

main();
