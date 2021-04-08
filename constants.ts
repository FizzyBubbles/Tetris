import { newGameBoard } from "./collision";
import { GameState } from "./types";

export const KeyBindings = {
	left: 85,
	right: 48,
	rotateClockwise: 70,
	rotateAntiClockwise: 83,
	softDrop: 57,
	hardDrop: 32,
	hold: 68,
	reset: 82
};

export const pieces: string[] = [
	"O_PIECE",
	"I_PIECE",
	"J_PIECE",
	"L_PIECE",
	"S_PIECE",
	"Z_PIECE",
	"T_PIECE"
];

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
		colour: COLOURSCHEME[1],
		shape: [
			{ x: -0.5, y: -0.5 },
			{ x: 0.5, y: -0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: -0.5, y: 0.5 }
		]
	},
	I_PIECE: {
		id: 2,
		colour: COLOURSCHEME[2],
		shape: [
			{ x: 0.5, y: -1.5 },
			{ x: 0.5, y: -0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: 0.5, y: 1.5 }
		]
	},
	J_PIECE: {
		id: 3,
		colour: COLOURSCHEME[3],
		shape: [
			{ x: 0.5, y: -1.5 },
			{ x: 0.5, y: -0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: -0.5, y: 0.5 }
		]
	},
	L_PIECE: {
		id: 4,
		colour: COLOURSCHEME[4],
		shape: [
			{ x: -0.5, y: -1.5 },
			{ x: -0.5, y: -0.5 },
			{ x: -0.5, y: 0.5 },
			{ x: 0.5, y: 0.5 }
		]
	},
	S_PIECE: {
		id: 5,
		colour: COLOURSCHEME[5],
		shape: [
			{ x: -0.5, y: -0.5 },
			{ x: -0.5, y: 0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: 0.5, y: 1.5 }
		]
	},
	Z_PIECE: {
		id: 6,
		colour: COLOURSCHEME[6],
		shape: [
			{ x: 0.5, y: -0.5 },
			{ x: -0.5, y: 0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: -0.5, y: 1.5 }
		]
	},
	T_PIECE: {
		id: 7,
		colour: COLOURSCHEME[7],
		shape: [
			{ x: -0.5, y: 0.5 },
			{ x: 0.5, y: 0.5 },
			{ x: 0.5, y: 1.5 },
			{ x: 1.5, y: 0.5 }
		]
	}
};

export const STARTINGPOS = { x: 3.5, y: -0.5 };

// whole game state
export const NewGameState: GameState = {
	cummulativeLineClears: 10,
	level: 0,
	score: 0,
	piece: PIECE.L_PIECE,
	pos: STARTINGPOS,
	board: newGameBoard(10)(20)
};
