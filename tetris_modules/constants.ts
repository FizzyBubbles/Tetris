import { Settings } from "./types";
import { newGameBoard } from "./collision";
import { GameState, Piece } from "./types";
import { random7Bag, randomPiece } from "./random";
import { subtract, add } from "./complex";
import { cloneDeep } from "lodash";

export const tomKEYBINDINGS = {
	left: [85],
	right: [48],
	rotateClockwise: [70],
	rotateAntiClockwise: [83],
	softDrop: [57],
	hardDrop: [32],
	hold: [68],
	reset: [82],
	pause: [27]
}; // the best keybindings

export const KEYBINDINGS = {
	left: [37],
	right: [39],
	rotateClockwise: [88, 38],
	rotateAntiClockwise: [17, 90],
	softDrop: [40],
	hardDrop: [32],
	hold: [67, 16],
	reset: [82],
	pause: [27]
}; // lame bad keybindings for beta children

export const DEFAULTSETTINGS: Settings = {
	holdActive: true,
	randomChoice: "7-BAG",
	keyBindings: KEYBINDINGS,
	dropShadow: true
}; // default settings

export const CELL = {
	EMPTY: 0,
	O_PIECE: 1,
	I_PIECE: 2,
	J_PIECE: 3,
	L_PIECE: 4,
	S_PIECE: 5,
	Z_PIECE: 6,
	T_PIECE: 7
}; // stores all the arbitrary piece values

export const COLOURSCHEME = [
	"#000000",
	"#ffe100",
	"#00eeff",
	"#0000b5",
	"#de7e00",
	"#51cb39",
	"#cd3300",
	"#8315c8"
]; // stores the colour scheme

export const PIECE = {
	O_PIECE: {
		id: 1,
		name: "O_PIECE",
		colour: COLOURSCHEME[1],
		rotationState: 0,
		rotationalCentre: { x: 0.5, y: -0.5 },
		shape: [
			{ x: 0, y: 0 },
			{ x: 0, y: -1 },
			{ x: 1, y: 0 },
			{ x: 1, y: -1 }
		]
	},
	I_PIECE: {
		id: 2,
		name: "I_PIECE",
		colour: COLOURSCHEME[2],
		rotationState: 0,
		rotationalCentre: { x: 1.5, y: -0.5 },
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 }
		]
	},
	J_PIECE: {
		id: 3,
		name: "J_PIECE",
		colour: COLOURSCHEME[3],
		rotationState: 0,
		rotationalCentre: { x: 1, y: 0 },
		shape: [
			{ x: 0, y: -1 },
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 }
		]
	},
	L_PIECE: {
		id: 4,
		name: "L_PIECE",
		colour: COLOURSCHEME[4],
		rotationState: 0,
		rotationalCentre: { x: 1, y: 0 },
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 2, y: -1 }
		]
	},
	S_PIECE: {
		id: 5,
		name: "S_PIECE",
		colour: COLOURSCHEME[5],
		rotationState: 0,
		rotationalCentre: { x: 1, y: 0 },
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: -1 },
			{ x: 2, y: -1 }
		]
	},
	Z_PIECE: {
		id: 6,
		name: "Z_PIECE",
		colour: COLOURSCHEME[6],
		rotationState: 0,
		rotationalCentre: { x: 1, y: 0 },
		shape: [
			{ x: 0, y: -1 },
			{ x: 1, y: -1 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 }
		]
	},
	T_PIECE: {
		id: 7,
		name: "T_PIECE",
		colour: COLOURSCHEME[7],
		rotationState: 0,
		rotationalCentre: { x: 1, y: 0 },
		shape: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 1, y: -1 },
			{ x: 2, y: 0 }
		]
	}
}; // every piece

export const PIECES: Piece[] = [
	PIECE.I_PIECE,
	PIECE.J_PIECE,
	PIECE.L_PIECE,
	PIECE.O_PIECE,
	PIECE.S_PIECE,
	PIECE.T_PIECE,
	PIECE.Z_PIECE
]; // a scrambleable list of all the pieces

export const STARTINGPOS = { x: 4, y: -1 }; // the starting displacement of the pieces

export const FAILSCREENMESSAGES = [
	"YOU ARE DIE",
	"WOW THAT SUCKED!",
	"BRUH",
	"BOB COULDN'T FIX IT",
	"CATASTROPHIC",
	"THAT WAS QUICK",
	"WHAT THE DUCK!",
	"BETTER DUCK NEXT TIME",
	"K.O.",
	"FATALITY",
	"F",
	"BETA GAMER",
	"JUST QUIT ALREADY"
]; // a lil cheeky cheeky

// returns a cleared gameState but retains the high score
export const resetGameState = (HighScore: number): GameState => {
	const firstPiece = randomPiece();
	return cloneDeep({
		queue: random7Bag(),
		cummulativeLineClears: 0,
		level: 0,
		score: 0,
		highScore: HighScore,
		piece: {
			...firstPiece,
			shape: firstPiece.shape.map(subtract(firstPiece.rotationalCentre))
		},
		pos: add(firstPiece.rotationalCentre)(STARTINGPOS),
		board: newGameBoard(10)(20),
		tick: 0,
		paused: false,
		holdPiece: "empty",
		holdFresh: true,
		fail: false,
		failMessage: "FAILED",
		settings: DEFAULTSETTINGS
	});
};
