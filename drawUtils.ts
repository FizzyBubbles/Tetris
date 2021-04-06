import { Piece, Complex } from "./types";
import { add } from "./complex";

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

// draws a specified piece at a given position
export const drawPiece = (piece: Piece) => (position: Complex): void => {
	const colourSquare = drawSquare(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
};
