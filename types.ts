//complex number
export type Complex = {
	x: number; // real part
	y: number; // imaginary part
};

export type Piece = {
	id: number;
	colour: string;
	shape: Complex[];
};

export type GameState = {
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
