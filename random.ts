import { Piece } from "./types";
import { PIECES, PIECE } from "./constants";
import { cloneDeep } from "lodash";

export const randomPiece = (): Piece =>
	PIECES[Math.trunc(Math.random() * PIECES.length)];

export const randomPieces = (numberOfRandomPieces: number): Piece[] => {
	let output = [];
	for (let i = 0; i < numberOfRandomPieces; i++) {
		output.push(randomPiece());
	}
	return output;
};

const shuffle = (pieces: Piece[]) =>
	cloneDeep(pieces).sort(() => Math.random() - 0.5);

export const randomBag = (): Piece[] => shuffle(PIECES);
