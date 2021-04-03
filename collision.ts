import { Complex, Piece, GameState, GameBoard } from "./types";
import { CANVAS, drawSquare } from "./drawUtils";
import { COLOURSCHEME } from "./constants";
import { add } from "./complex";

// checks if two pieces have collided
export const squareCollision = (position1: Complex) => (position2: Complex) => {
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
	piece.shape.map(blockPosition => add(blockPosition)(position));

export const collisionDetection = (gameState: GameState) => {
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

export const addPieceToGrid = (gameState: GameState): GameState => {
	let GS = Object.assign({}, gameState);
	relativePos(GS.piece)(GS.pos).forEach(element => {
		GS.board[Math.trunc(element.y)][Math.trunc(element.x)] = GS.piece.id;
	});
	return GS;
};
