import { Piece } from "./types";
import { pieces, PIECE } from "./constants";

export const randomPiece = (): Piece =>
	pieces[Math.trunc(Math.random() * pieces.length)];

export const randomPieces = (numberOfRandomPieces: number): Piece[] => {
	let output = [];
	for (let i = 0; i < numberOfRandomPieces; i++) {
		output.push(randomPiece());
	}
	return output;
};
