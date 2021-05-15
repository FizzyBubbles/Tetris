//complex number
export type Complex = {
	x: number; // real part
	y: number; // imaginary part
};

export type PieceName =
	| "O_PIECE"
	| "I_PIECE"
	| "J_PIECE"
	| "L_PIECE"
	| "S_PIECE"
	| "Z_PIECE"
	| "T_PIECE";

export type rotationState = 0 | 1 | 2 | 3;

export type Piece = {
	id: number;
	rotationState: number;
	name: string;
	colour: string;
	shape: Complex[];
	rotationalCentre: Complex;
};

export type GameState = {
	queue: Piece[];
	cummulativeLineClears: number;
	level: number;
	score: number;
	piece: Piece;
	pos: Complex;
	board: GameBoard;
};

export type Input = {
	rotation: Transformation;
	translation: Transformation;
};

export type Transformation = (position: Complex) => Complex;

export type GameBoard = number[][];
