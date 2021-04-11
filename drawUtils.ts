import { Piece, Complex, GameBoard, GameState } from "./types";
import { add } from "./complex";
import { COLOURSCHEME } from "./constants";

// Main Game Board Canvas references
export let gameCanvas = document.getElementById("board") as HTMLCanvasElement;
export let gameBoardContext = gameCanvas.getContext("2d");

// Queue canvas display
export let queueCanvas = document.getElementById("queue") as HTMLCanvasElement;
export let queueContext = queueCanvas.getContext("2d");

// draw square
export const drawSquareGameBoard = (colour: string) => (
	position: Complex
): void => {
	if (!gameBoardContext) return;
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;
	gameBoardContext.fillStyle = colour;
	gameBoardContext.fillRect(
		position.x * WIDTH,
		position.y * HEIGHT,
		WIDTH,
		HEIGHT
	);
};

const drawPoint = (colour: string) => (position: Complex): void => {
	if (!gameBoardContext) return;
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;
	gameBoardContext.fillStyle = colour;
	gameBoardContext.fillRect(position.x * WIDTH, position.y * HEIGHT, 5, 5);
};

// draws a specified piece at a given position
export const drawPieceGameBoard = (piece: Piece) => (
	position: Complex
): void => {
	const colourSquare = drawSquareGameBoard(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
	drawPoint("b")(position);
};

//QUEUE DRAWING

export const drawSquareQueue = (colour: string) => (
	position: Complex
): void => {
	if (!queueContext) return;
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;
	queueContext.fillStyle = colour;
	queueContext.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

// draws a specified piece at a given position on the Queue
export const drawPieceQueue = (piece: Piece) => (position: Complex): void => {
	const colourSquare = drawSquareQueue(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
};

export const clearQueue = (colour: string): void => {
	if (!queueContext) return;
	const HEIGHT = gameCanvas.clientHeight;
	const WIDTH = gameCanvas.clientWidth;
	queueContext.fillStyle = colour;
	queueContext.fillRect(0, 0, WIDTH, HEIGHT);
};

export const drawGrid = (grid: GameBoard): void => {
	// goes through each element of the grid and draws the respective cell.
	grid.forEach((
		row,
		i // for each row
	) =>
		row.forEach((cell, j) => {
			// for each cell within the row
			// console.log(cell);
			drawSquareGameBoard(COLOURSCHEME[cell])({ x: j, y: i });
		})
	);
};

// handles drawing on the canvas
export const draw = (gameState: GameState): void => {
	drawGrid(gameState.board);
	drawPieceGameBoard(gameState.piece)(gameState.pos);
};
