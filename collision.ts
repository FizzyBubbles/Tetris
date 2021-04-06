import { Complex, Piece, GameState, GameBoard } from "./types";
import { CANVAS } from "./drawUtils";
import { add } from "./complex";

// checks if two pieces have collided
export const squareCollision = (position1: Complex) => (position2: Complex) => {
	if (!CANVAS) return;
	const HEIGHT = CANVAS.clientHeight / 20;
	const WIDTH = CANVAS.clientWidth / 10;
	return (
		position1.x < position2.x + WIDTH &&
		position1.x + WIDTH > position2.x &&
		position1.y < position2.y + HEIGHT &&
		position1.y + HEIGHT > position2.y
	);
};

export const relativePos = (piece: Piece) => (position: Complex) =>
	piece.shape.map(blockPosition => add(blockPosition)(position)); // returns the position of all the blocks in a piece plus the position.

export const pieceCollided = (gameState: GameState) => {
	const pieceLocation = relativePos(gameState.piece)(gameState.pos);
	let collided = false;
	for (let i = 0; i < pieceLocation.length; i++) {
		// console.log("x: " + pieceLocation[i].x, "y: " + pieceLocation[i].y);
		if (
			pieceLocation[i].x < 0 || // checks if piece location is left of the boundary
			pieceLocation[i].x >= 10 || // checks if piece location to the right of the boundary
			pieceLocation[i].y >= 20 // checks if piece location is above the bottom
		) {
			collided = true;
		} else if (pieceLocation[i].y >= 0) {
			// checks if piece location is lower than the top )
			if (
				gameState.board[Math.trunc(pieceLocation[i].y)][
					Math.trunc(pieceLocation[i].x)
				]
			) {
				collided = true;
			}
		}
	}
	return collided;
};

export const addPieceToGrid = (gameState: GameState): GameState => {
	let GS = Object.assign({}, gameState);
	relativePos(GS.piece)(GS.pos).forEach(element => {
		GS.board[Math.trunc(element.y)][Math.trunc(element.x)] = GS.piece.id;
	});
	return GS;
};
