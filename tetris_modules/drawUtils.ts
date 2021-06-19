import { hardDrop } from "./collision";
import { Piece, Complex, GameBoard, GameState } from "./types";
import { add } from "./complex";
import { COLOURSCHEME } from "./constants";

// Main Game Board Canvas references
let gameCanvas = document.getElementById("board") as HTMLCanvasElement;
let gameBoardContext = gameCanvas.getContext("2d") as CanvasRenderingContext2D;

// Queue canvas display
let queueCanvas = document.getElementById("queue") as HTMLCanvasElement;
let queueContext = queueCanvas.getContext("2d") as CanvasRenderingContext2D;

// Hold canvas references
let holdCanvas = document.getElementById("hold") as HTMLCanvasElement;
let holdContext = holdCanvas.getContext("2d") as CanvasRenderingContext2D;

// draw square
export const drawSquareGameBoard = (colour: string) => (
	position: Complex
): void => {
	if (!gameBoardContext) return;
	// height and width of each square
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;

	// sets to appropiate colour
	gameBoardContext.fillStyle = colour;

	// fills the square
	gameBoardContext.fillRect(
		position.x * WIDTH,
		position.y * HEIGHT,
		WIDTH,
		HEIGHT
	);
};

export const drawSquareQueue = (colour: string) => (
	position: Complex
): void => {
	if (!queueContext) return;
	// height and width of each square
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;

	// sets to appropriate colour
	queueContext.fillStyle = colour;

	// fills the square
	queueContext.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

export const drawSquareHold = (colour: string) => (position: Complex): void => {
	if (!holdContext) return;

	// height and width of each square
	const HEIGHT = gameCanvas.clientHeight / 20;
	const WIDTH = gameCanvas.clientWidth / 10;

	// sets to appropriate colour
	holdContext.fillStyle = colour;

	// fills the square
	holdContext.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

// draws a specified piece at a given position
export const drawPieceGameBoard = (piece: Piece) => (
	position: Complex
): void => {
	// returns a function that draws a square with the colour of the piece
	const colourSquare = drawSquareGameBoard(piece.colour);

	// returns a function which displaces the piece by the position
	const displace = add(position);

	// draws each cell in its location
	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	});
};

export const drawGhostPiece = (gameState: GameState): void => {
	// finds the lowest possible position for the piece before collision
	const state = hardDrop(gameState);

	// sets the regular colour translucent
	const colour = [state.piece.colour.slice(0), "46"].join("");

	// returns a function that draws a square with the colour of the piece
	const colourSquare = drawSquareGameBoard(colour);

	// returns a function which displaces the piece by the hard drop position
	const displace = add(state.pos);

	// draws each cell in its location
	state.piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	});
};

// draws a specified piece at a given position on the Queue
export const drawPieceQueue = (piece: Piece) => (position: Complex): void => {
	// returns a function that draws a square with the colour of the piece
	const colourSquare = drawSquareQueue(piece.colour);

	// returns a function which displaces the piece by the position
	const displace = add(position);

	// draws each cell in its location
	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	});
};

// draws a specified piece at a given position on the Queue
export const drawPieceHold = (piece: Piece) => (position: Complex): void => {
	// returns a function that draws a square with the colour of the piece
	const colourSquare = drawSquareHold(piece.colour);

	// returns a function which displaces the piece by the position
	const displace = add(position);

	// draws each cell in its location
	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	});
};

export const fillBoard = (colour: string): void => {
	if (!queueContext) return;

	// sets the height and width to the size of the board
	const HEIGHT = gameCanvas.clientHeight;
	const WIDTH = gameCanvas.clientWidth;

	// sets the appropriate colour
	gameBoardContext.fillStyle = colour;

	// fills the entire board
	gameBoardContext.fillRect(0, 0, WIDTH, HEIGHT);
};

export const fillQueue = (colour: string): void => {
	if (!queueContext) return;

	// sets the height and width to the size of the queue
	const HEIGHT = queueCanvas.clientHeight;
	const WIDTH = queueCanvas.clientWidth;

	// sets the appropriate colour
	queueContext.fillStyle = colour;

	// fills the entire queue
	queueContext.fillRect(0, 0, WIDTH, HEIGHT);
};

export const fillHold = (colour: string): void => {
	if (!holdContext) return;

	// sets the height and width to the size of the hold display
	const HEIGHT = holdCanvas.clientHeight;
	const WIDTH = holdCanvas.clientWidth;

	// sets the appropriate colour
	holdContext.fillStyle = colour;

	// fills the entire hold display
	holdContext.fillRect(0, 0, WIDTH, HEIGHT);
};

export const drawGrid = (grid: GameBoard): void => {
	// goes through each element of the grid and draws the respective cell.
	grid.forEach((
		row,
		Y // for each row
	) =>
		row.forEach((cell, X) => {
			// for each cell within the row
			drawSquareGameBoard(COLOURSCHEME[cell])({ x: X, y: Y });
		})
	);
};

export const drawPauseShadow = (paused: Boolean): void => {
	if (!gameBoardContext || !queueContext || !holdContext) return;

	if (paused) {
		// fills board a translucent gray
		fillBoard("#29292990");

		// blurs queue and hold canvas
		queueContext.filter = "blur(50px)";
		holdContext.filter = "blur(50px)";

		// writes pause in centred in helvetica
		gameBoardContext.font = "50px Helvetica";
		gameBoardContext.fillStyle = "white";
		gameBoardContext.textAlign = "center";
		gameBoardContext.fillText(
			"PAUSED",
			gameCanvas.width / 2,
			gameCanvas.height / 3
		);
	} else {
		// if not paused removes all filters
		gameBoardContext.filter = "none";
		queueContext.filter = "none";
		holdContext.filter = "none";
	}
};

export const drawFailScreen = (state: GameState): void => {
	if (!gameBoardContext || !queueContext || !holdContext) return;
	const fail = state.fail;
	if (fail) {
		// fills board a translucent gray
		fillBoard("#29292990");

		// blurs queue and hold canvas
		queueContext.filter = "blur(50px)";
		holdContext.filter = "blur(50px)";

		// writes fail message centred in helvetica
		gameBoardContext.font = "25px Helvetica";
		gameBoardContext.fillStyle = "white";
		gameBoardContext.textAlign = "center";
		gameBoardContext.fillText(
			state.failMessage,
			gameCanvas.width / 2,
			gameCanvas.height / 3
		);

		// writes score underneath the fail message
		gameBoardContext.font = "40px Helvetica";
		gameBoardContext.fillText(
			state.score.toString(),
			gameCanvas.width / 2,
			gameCanvas.height / 2
		);
	} else {
		// if not failed removes all filters
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

// applies an element function to a HTML element
export const elementMap = (elementId: string) => (
	elementFunction: (e: HTMLElement) => void
) => {
	const element = document.getElementById(elementId);
	if (!element) return;

	elementFunction(element);
};

// sets the inner HTML of an element
export const setElementInnerHTML = (elementId: string) => (content: string) => {
	elementMap(elementId)(element => (element.innerHTML = content));
};
