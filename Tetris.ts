import { cloneDeep } from "lodash";
import { pieces, CELL, COLOURSCHEME, PIECE, KeyBindings } from "./constants";
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

const updatePiece = (piece: Piece) => (
	transformation: Transformation
): Piece => ({
	id: piece.id,
	colour: piece.colour,
	shape: piece.shape.map(transformation)
});

// checks if two pieces have collided
const squareCollision = (position1: Complex) => (position2: Complex) => {
	const HEIGHT = CANVAS.clientHeight / 20;
	const WIDTH = CANVAS.clientWidth / 10;
	return (
		position1.x < position2.x + WIDTH &&
		position1.x + WIDTH > position2.x &&
		position1.y < position2.y + HEIGHT &&
		position1.y + HEIGHT > position2.y
	);
};

const relativePos = (piece: Piece) => (position: Complex) =>
	piece.shape.map(blockPosition => add(blockPosition)(position));

const collisionDetection = (gameState: GameState) => {
	const pieceLocation = relativePos(gameState.piece)(gameState.pos);
	for (let i = 0; i < pieceLocation.length; i++) {
		if (pieceLocation[i].x >= 0 && pieceLocation[i].y >= 0) {
			if (
				gameState.board[Math.trunc(pieceLocation[i].y)][
					Math.trunc(pieceLocation[i].x)
				]
			) {
				return true;
			}
		}
	}
	return false;
};

// whole game state
var GAMESTATE: GameState = {
	piece: PIECE.L_PIECE,
	pos: { x: 4, y: 0 },
	board: newGameBoard(10)(20)
};
GAMESTATE.board[19] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

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

const addPieceToGrid = (gameState: GameState): GameState => {
	let GS = Object.assign({}, gameState);
	relativePos(GS.piece)(GS.pos).forEach(element => {
		GS.board[Math.trunc(element.y)][Math.trunc(element.x)] = GS.piece.id;
	});
	return GS;
};

// updates GameState
const update = (input: Input) => (gameState: GameState): void => {
	//console.log(updatePiece(gameState.piece)(input.rotation), gameState);
	// let GS: GameState = Object.assign({}, gameState); // temporarily stores the next game state.

	let GS: GameState = cloneDeep(gameState); // temporarily stores the next game state.
	GS.piece = updatePiece(gameState.piece)(input.rotation);
	GS.pos = input.translation(gameState.pos);
	if (collisionDetection(GS)) {
		GS = Object.assign({}, addPieceToGrid(gameState));

		const randPiece: Piece =
			PIECE[pieces[Math.floor(Math.random() * pieces.length)]];

		gameState.piece = {
			shape: randPiece.shape.map(add({ x: -1.5, y: -1.5 })),
			id: randPiece.id,
			colour: randPiece.colour
		};

		gameState.pos = { x: 3.5, y: 0.5 };
		console.log(GS, gameState);
	} else {
		gameState = Object.assign({}, GS);
	}
	GAMESTATE = gameState;
	draw(gameState);
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
		update({ rotation: ID, translation: down })(
			Object.assign({}, Object.assign({}, GAMESTATE))
		);
		oop = 0;
	}
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

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

// const tetrisReducer = (state: GameState, action: GameAction): GameState => {
const tetrisReducer = (state: GameState, action: GameAction): GameState => {
	switch (action) {
		case "MOVE-LEFT":
			return {
				pos: updatePiece(state.piece)(left),
				...state
			};
		case "MOVE-RIGHT":
			return {
				pos: updatePiece(state.piece)(right),
				...state
			};
		case "MOVE-DOWN":
			return {
				pos: updatePiece(state.piece)(left),
				...state
			};
		case "ROTATE-ANTICLOCKWISE":
			return {
				pos: updatePiece(state.piece)(left),
				...state
			};
		case "ROTATE-CLOCKWISE":
			return {
				pos: updatePiece(state.piece)(left),
				...state
			};
		case "CLOCK-TICK":
			return {
				pos: updatePiece(state.piece)(down),
				...state
			};
	}
};

document.onkeydown = e => {
	switch (e.which) {
		case KeyBindings.left:
			update({ rotation: ID, translation: left })(Object.assign({}, GAMESTATE));
			break;
		case KeyBindings.right:
			update({ rotation: ID, translation: right })(
				Object.assign({}, GAMESTATE)
			);
			break;
		case KeyBindings.rotateClockwise:
			update({ rotation: rotateClockwise, translation: ID })(
				Object.assign({}, GAMESTATE)
			);
			break;
		case KeyBindings.rotateAntiClockwise:
			update({ rotation: rotateAntiClockwise, translation: ID })(
				Object.assign({}, GAMESTATE)
			);
			break;
		case KeyBindings.hold:
			go = !go;
			break;
	}
};
