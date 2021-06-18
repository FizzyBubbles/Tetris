import { hardDrop } from "./collision";
import { Piece, Complex, GameBoard, GameState } from "./types";
import { add } from "./complex";
import { COLOURSCHEME, FAILSCREENMESSAGES } from "./constants";

// Main Game Board Canvas references
export let gameCanvas = document.getElementById("board") as HTMLCanvasElement;
export let gameBoardContext =
	typeof gameCanvas != null ? gameCanvas.getContext("2d") : null;

// Queue canvas display
export let queueCanvas = document.getElementById("queue") as HTMLCanvasElement;
export let queueContext = queueCanvas.getContext("2d");

// Hold canvas references
export let holdCanvas = document.getElementById("hold") as HTMLCanvasElement;
let holdContext = holdCanvas.getContext("2d") as CanvasRenderingContext2D;

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
	// gameBoardContext.strokeStyle = colour == "#000000" ? colour : "white";
	// gameBoardContext.strokeRect(
	// 	position.x * WIDTH,
	// 	position.y * HEIGHT,
	// 	WIDTH,
	// 	HEIGHT
	// );
};

export const drawSquareQueue = (colour: string) => (
	position: Complex
): void => {
	if (!queueContext) return;
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;
	queueContext.fillStyle = colour;
	queueContext.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

export const drawSquareHold = (colour: string) => (position: Complex): void => {
	if (!holdContext) return;
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;
	holdContext.fillStyle = colour;
	holdContext.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

export const drawPoint = (colour: string) => (position: Complex): void => {
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
	//drawPoint("b")(position);
};

export const drawPieceDropShadow = (gameState: GameState): void => {
	const state = hardDrop(gameState);
	const colour = [state.piece.colour.slice(0), "46"].join("");
	const colourSquare = drawSquareGameBoard(colour); // returns a function that draws a square with the colour of the piece

	const displace = add(state.pos); // returns a function which displaces the piece by the hard drop position

	state.piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
	//drawPoint("b")(position);
};

// draws a specified piece at a given position on the Queue
export const drawPieceQueue = (piece: Piece) => (position: Complex): void => {
	const colourSquare = drawSquareQueue(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
};

// draws a specified piece at a given position on the Queue
export const drawPieceHold = (piece: Piece) => (position: Complex): void => {
	const colourSquare = drawSquareHold(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
};

export const fillQueue = (colour: string): void => {
	if (!queueContext) return;
	const HEIGHT = queueCanvas.clientHeight;
	const WIDTH = queueCanvas.clientWidth;
	queueContext.fillStyle = colour;
	queueContext.fillRect(0, 0, WIDTH, HEIGHT);
};

export const fillHold = (colour: string): void => {
	if (!holdContext) return;
	const HEIGHT = holdCanvas.clientHeight;
	const WIDTH = holdCanvas.clientWidth;
	holdContext.fillStyle = colour;
	holdContext.fillRect(0, 0, WIDTH, HEIGHT);
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

export const drawPauseShadow = (paused: Boolean): void => {
	if (!gameBoardContext || !queueContext || !holdContext) return;
	if (paused) {
		// gameBoardContext.filter = "blur(2px)";
		gameBoardContext.fillStyle = "#29292990";
		gameBoardContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

		queueContext.filter = "blur(50px)";
		holdContext.filter = "blur(50px)";
		gameBoardContext.font = "50px Helvetica";
		gameBoardContext.fillStyle = "white";
		gameBoardContext.textAlign = "center";
		gameBoardContext.fillText(
			"PAUSED",
			gameCanvas.width / 2,
			gameCanvas.height / 3
		);
	} else {
		gameBoardContext.filter = "none";
		queueContext.filter = "none";
		holdContext.filter = "none";
	}
};

export const drawFailScreen = (state: GameState): void => {
	if (!gameBoardContext || !queueContext || !holdContext) return;
	const fail = state.fail;
	if (fail) {
		// gameBoardContext.filter = "blur(2px)";
		gameBoardContext.fillStyle = "#29292990";
		gameBoardContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

		queueContext.filter = "blur(50px)";
		holdContext.filter = "blur(50px)";
		gameBoardContext.font = "25px Helvetica";
		gameBoardContext.fillStyle = "white";
		gameBoardContext.textAlign = "center";
		gameBoardContext.fillText(
			state.failMessage,
			gameCanvas.width / 2,
			gameCanvas.height / 3
		);
		gameBoardContext.fillStyle = "white";
		gameBoardContext.fillText(
			state.score.toString(),
			gameCanvas.width / 2,
			gameCanvas.height / 2
		);
	} else {
		gameBoardContext.filter = "none";
		queueContext.filter = "none";
		holdContext.filter = "none";
	}
};

// handles drawing on the canvas
export const draw = (gameState: GameState): void => {
	drawGrid(gameState.board);
	drawPieceGameBoard(gameState.piece)(gameState.pos);
	drawPauseShadow(gameState.paused);
};
