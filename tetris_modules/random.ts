import { Piece } from "./types";
import { PIECES, PIECE } from "./constants";
import { cloneDeep } from "lodash";
import { FAILSCREENMESSAGES } from "./SETTINGS";

export const randomPiece = (): Piece =>
	PIECES[Math.trunc(Math.random() * PIECES.length)]; // picks a random piece from the PIECES array

// generates an array of random pieces at a specified length
export const randomPieces = (numberOfRandomPieces: number): Piece[] => {
	let output: Piece[] = []; // stores the random pieces
	for (let i = 0; i < numberOfRandomPieces; i++) {
		output.push(randomPiece()); // adds the number of random pieces to the output
	}
	return output;
};

// shuffles an array of Pieces
const shuffle = (pieces: Piece[]) =>
	cloneDeep(pieces).sort(() => Math.random() - 0.5); // clone deep gets past the object pointers, and the sort function places each element at a random location.
export const randomMessage = (): string =>
	FAILSCREENMESSAGES[Math.floor(Math.random() * FAILSCREENMESSAGES.length)];
export const random7Bag = (): Piece[] => shuffle(PIECES); // returns a shuffled bag of all the pieces
