const CELL = {
	EMPTY: 0,
	O_PIECE: 1,
	I_PIECE: 2,
	J_PIECE: 3,
	L_PIECE: 4,
	S_PIECE: 5,
	Z_PIECE: 6,
	T_PIECE: 7
}; // stores all the arbitrary piece values
const COLOURSCHEME = [
	"#000000",
	"#ffe100",
	"#00eeff",
	"#0000b5",
	"#de7e00",
	"#51cb39",
	"#cd3300",
	"#y8315c8"
]; // stores the colour scheme
const PIECE = {
	O_PIECE: {
		colour: COLOURSCHEME[1],
		shape: [
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 1, y: 2 }
		]
	},
	I_PIECE: {
		colour: COLOURSCHEME[2],
		shape: [
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 }
		]
	},
	J_PIECE: {
		colour: COLOURSCHEME[3],
		shape: [
			{ x: 2, y: 0 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 },
			{ x: 1, y: 2 }
		]
	},
	L_PIECE: {
		colour: COLOURSCHEME[4],
		shape: [
			{ x: 1, y: 0 },
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 }
		]
	},
	S_PIECE: {
		colour: COLOURSCHEME[5],
		shape: [
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 }
		]
	},
	Z_PIECE: {
		colour: COLOURSCHEME[6],
		shape: [
			{ x: 2, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 1, y: 3 }
		]
	},
	T_PIECE: {
		colour: COLOURSCHEME[7],
		shape: [
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 2, y: 3 },
			{ x: 3, y: 2 }
		]
	}
};
const KeyBindings = {left: 85, right: 48, rotateClockwise: 70, rotateAnticlockwise: 83, softDrop: 57, hardDrop: 32, hold: 68};

let CANVAS = document.getElementById("board");
let c = CANVAS.getContext("2d");

type piece = {
	colour: string;
	shape: complex[];
};

type GameState = {
	piece: piece;
	pos: complex;
	board: GameBoard;
};

type Input = {
	rotation: Transformation;
	translation: Transformation;
};

type Transformation = (position: complex) => complex;

//complex number
type complex = {
	x: number; // real part
	y: number; // imaginary part
}; // complex number

type GameBoard = number[][];

const ID = <A>(a: A): A => a;

// adds two complex numbers
const add = (n1: complex) => (n2: complex): complex => ({
	x: n1.x + n2.x,

	y: n1.y + n2.y
});

// multiplies two complex numbers -> This is the expanded form of (a+bi)(c+di)
const multiply = (n1: complex) => (n2: complex): complex => ({
	x: n1.x * n2.x - n1.y * n2.y,

	y: n1.y * n2.x + n1.x * n2.y
});

// takes an angle in radians and returns the complex unit vector in that angle
const cis = (angle: number): complex => ({
	x: Math.cos(angle),
	y: Math.sin(angle)
});

// rotates by whatever angle given (in radians)
const rotate = (angle: number) => (position: complex): complex =>
	multiply(cis(angle))(position);

const rotateClockwise: Transformation = rotate(-Math.PI / 2);
const down: Transformation = add({ x: 0, y: 1 });

// draw square
const drawSquare = (colour: string) => (position: complex): void => {
	const HEIGHT = CANVAS.clientHeight / 20;
	const WIDTH = CANVAS.clientWidth / 10;
	c.fillStyle = colour;
	c.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

// draws a specified piece at a given position
const drawPiece = (piece: piece) => (position: complex): void => {
	const colourSquare = drawSquare(piece.colour); // returns a function that draws a square with the colour of the piece
	const displace = add(position); // returns a function which displaces the piece by the position

	piece.shape.forEach(cell => {
		colourSquare(displace(cell));
	}); // draws each cell in its location
};

// returns a game board of specified size with each value being an empty cell
const newGameBoard = (rows: number) => (columns: number): GameBoard => {
	let constructedBoard: GameBoard = [];
	for (let col = 0; col < columns; col++) {
		// loops through the columns and pushes the rows of empty cells into the 2d array game board
		let constructedRow = [];
		for (let row = 0; row < rows; row++) {
			// creates rows of empty cells at a specified length
			constructedRow.push(CELL.EMPTY);
		}
		// pushes the constructed row into the game board
		constructedBoard.push(constructedRow);
	}
	return constructedBoard;
};

const updatePiece = (piece: piece) => (
	transformation: Transformation
): piece => ({ colour: piece.colour, shape: piece.shape.map(transformation) });

var gameState: GameState = {
	piece: PIECE.S_PIECE,
	pos: { x: 4, y: 4 },
	board: newGameBoard(10)(20)
};
gameState.piece.shape = gameState.piece.shape.map(add({ x: -2, y: -2 }));

const drawGrid = (grid: GameBoard): void => {
	// goes through each element of the grid and draws the respective cell.
	grid.forEach((row, i) =>
		row.forEach((cell, j) => {
			console.log(cell);
			drawSquare(COLOURSCHEME[cell])({ x: j, y: i });
		})
	);
};

const update = (input: Input) => (gameState: GameState): void => {
	console.log(updatePiece(gameState.piece)(input.rotation), gameState);
	gameState.piece = updatePiece(gameState.piece)(input.rotation);
	gameState.pos = input.translation(gameState.pos);
	draw(gameState);
};

// handles drawing on the canvas
const draw = (gameState: GameState): void => {
	drawGrid(gameState.board);
	drawPiece(gameState.piece)(gameState.pos);
};

var oop = 0;

const loop = (timestamp: number) => {
	oop = oop + 1;
	if (oop == 60) {
		update({ rotation: ID, translation: down })(gameState);
		oop = 0;
	}
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

document.onkeydown = function(e) {
  switch (e) {
    case 
  }
	update({ rotation: rotateClockwise, translation: ID })(gameState);
};
