import { Piece, Complex, GameBoard } from "./types";
import { add } from "./complex";
import { COLOURSCHEME } from "./constants";

export let CANVAS = document.getElementById("board") as HTMLCanvasElement;
export let c = CANVAS.getContext("2d");

// draw square
export const drawSquare = (colour: string) => (position: Complex): void => {
	if (!c) return;
	const HEIGHT = CANVAS.clientHeight / 20;
	const WIDTH = CANVAS.clientWidth / 10;
	c.fillStyle = colour;
	c.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

const drawPoint = (colour: string) => (position: Complex): void => {
	if (!c) return;
	const HEIGHT = CANVAS.clientHeight / 20;
	const WIDTH = CANVAS.clientWidth / 10;
	c.fillStyle = colour;
	c.fillRect(position.x * WIDTH, position.y * HEIGHT, 5, 5);
	console.log("bruh");
};

// draws a specified piece at a given position
export const drawPiece = (piece: Piece) => (position: Complex): void => {
	const colourSquare = drawSquare(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location

	drawPoint("b")(position);
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
			drawSquare(COLOURSCHEME[cell])({ x: j, y: i });
		})
	);
};
