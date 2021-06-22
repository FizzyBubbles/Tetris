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

// see here for explanation https://four.lol/srs/kicks-overview
export enum RotationState {
	North,
	East,
	South,
	West
}

// see here for explanation https://four.lol/srs/kicks-overview
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

// Each action can have multiple keys bound to each
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

// TODO: move stats to a stat state
export type GameState = {
	queue: Piece[];
	cummulativeLineClears: number;
	level: number;
	score: number;
	highScore: number;
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
	autoRepeat: AutoRepeatSettings;
};

/**
 * The repeat delay in milliseconds is the pause between pressing a key and when it starts repeating.
 *
 * The repeat rate in milliseconds is the speed at which it repeats.
 */

export type AutoRepeatSettings = {
	delayMS: number;
	rateMS: number;
};

export type Input = {
	rotation: Transformation;
	translation: Transformation;
};

export type Transformation = (position: Complex) => Complex;

export type GameBoard = number[][];
