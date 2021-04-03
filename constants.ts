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
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 1, y: 2 }
		]
	},
	I_PIECE: {
		id: 2,
		colour: COLOURSCHEME[2],
		shape: [
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 }
		]
	},
	J_PIECE: {
		id: 3,
		colour: COLOURSCHEME[3],
		shape: [
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 1, y: 2 }
		]
	},
	L_PIECE: {
		id: 4,
		colour: COLOURSCHEME[4],
		shape: [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 }
		]
	},
	S_PIECE: {
		id: 5,
		colour: COLOURSCHEME[5],
		shape: [
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 }
		]
	},
	Z_PIECE: {
		id: 6,
		colour: COLOURSCHEME[6],
		shape: [
			{ x: 2, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 1, y: 3 }
		]
	},
	T_PIECE: {
		id: 7,
		colour: COLOURSCHEME[7],
		shape: [
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 },
			{ x: 3, y: 2 }
		]
	}
};

export const KeyBindings = {
	left: 85,
	right: 48,
	rotateClockwise: 70,
	rotateAntiClockwise: 83,
	softDrop: 57,
	hardDrop: 32,
	hold: 68
};
