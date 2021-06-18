//complex number
export type Complex = {
	x: number; // real part
	y: number; // imaginary part
};

// TODO: replace me with an enum
export type PieceName =
	| "O_PIECE"
	| "I_PIECE"
	| "J_PIECE"
	| "L_PIECE"
	| "S_PIECE"
	| "Z_PIECE"
	| "T_PIECE";

// export type rotationState = 0 | 1 | 2 | 3;

// TODO: add a comment explaining this
export enum RotationState {
	North,
	East,
	South,
	West
}

export enum KickRotationState {
	NE = "North -> East",
	NW = "North -> West",
	EN = "East -> North",
	ES = "East -> South",
	SE = "South -> East",
	SW = "South -> West",
	WS = "West -> South",
	WN = "West -> North"
}

export type Piece = {
	id: number;
	rotationState: RotationState;
	name: string;
	colour: string;
	shape: Complex[];
	rotationalCentre: Complex;
};

export type KeyBinding = {
	left: number[];
	right: number[];
	rotateClockwise: number[];
	rotateAntiClockwise: number[];
	softDrop: number[];
	hardDrop: number[];
	hold: number[];
	reset: number[];
	pause: number[];
};

export type GameState = {
	queue: Piece[];
	cummulativeLineClears: number;
	level: number;
	score: number;
	piece: Piece;
	pos: Complex;
	board: GameBoard;
	tick: number;
	paused: Boolean;
	holdPiece: Piece | "empty";
	holdFresh: Boolean;
	fail: Boolean;
	failMessage: string;
	settings: Settings;
};

export type randomSystem = "7-BAG" | "COMPLETELY-RANDOMISED";

export type Settings = {
	holdActive: boolean;
	randomChoice: randomSystem;
	keyBindings: KeyBinding;
	dropShadow: boolean;
};

export type Input = {
	rotation: Transformation;
	translation: Transformation;
};

export type Transformation = (position: Complex) => Complex;

export type GameBoard = number[][];
