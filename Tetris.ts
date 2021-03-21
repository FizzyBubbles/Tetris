const CELL = { EMPTY: 0, O_PIECE: 1 , I_PIECE: 2, J_PIECE: 3, L_PIECE: 4, S_PIECE: 5, Z_PIECE: 6, T_PIECE: 7}; // stores all the arbitrary piece values
const COLOURSCHEME = ["#000000", "#ffe100", "#00eeff", "#0000b5", "#de7e00", "#51cb39", "#cd3300", "#y8315c8"]; // stores the colour scheme
const PIECE = { 
  O_PIECE: {colour: COLOURSCHEME[1], shape: [{x:1, y:1}, {x:2, y:1}, {x:2, y:2}, {x:1, y:2}] },
  I_PIECE: {colour: COLOURSCHEME[2], shape: [{x:2, y:0}, {x:2, y:1}, {x:2, y:2}, {x:2, y:3}] },
  J_PIECE: {colour: COLOURSCHEME[3], shape: [{x:2, y:0}, {x:2, y:1}, {x:2, y:2}, {x:1, y:2}] },
  L_PIECE: {colour: COLOURSCHEME[4], shape: [{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:2, y:2}] },
  S_PIECE: {colour: COLOURSCHEME[5], shape: [{x:1, y:1}, {x:1, y:2}, {x:2, y:2}, {x:2, y:3}] },
  Z_PIECE: {colour: COLOURSCHEME[6], shape: [{x:2, y:1}, {x:1, y:2}, {x:2, y:2}, {x:1, y:3}] },
  T_PIECE: {colour: COLOURSCHEME[7], shape: [{x:1, y:2}, {x:2, y:2}, {x:2, y:3}, {x:3, y:2}] }
 };

let CANVAS = document.getElementById("board");
let c = CANVAS.getContext("2d");

type piece = {
  colour: string;
  shape: complex[];
}

type GameState = {
  Board: number[][];
};

type Transformation = (position:complex) => complex;

//complex number
type complex = {
  x: number; // real part
  y: number; // imaginary part
} // complex number

type GameBoard = number[][];

// adds two complex numbers
const add = (n1: complex) => (n2: complex):complex => ({
  x: n1.x + n2.x,

  y: n1.y + n2.y
}); 

// multiplies two complex numbers -> This is the expanded form of (a+bi)(c+di)
const multiply = (n1: complex) => (n2: complex):complex => ({
  x: ((n1.x * n2.x) - (n1.y * n2.y)),

  y: ((n1.y * n2.x) + (n1.x * n2.y))
}); 

// takes an angle in radians and returns the complex unit vector in that angle
const cis = (angle: number):complex => ({
  x: Math.cos(angle),
  y: Math.sin(angle)
}); 

// rotates by whatever angle given (in radians) 
const rotate = (angle: number) => (position: complex):complex => multiply(cis(angle))(position); 

const rotateClockwise: Transformation = rotate(-Math.PI / 2);

// draw square
const drawSquare = (colour: string) => (position: complex):void => {
  const HEIGHT = CANVAS.clientHeight/20;
  const WIDTH = CANVAS.clientWidth/10;
  c.fillStyle = colour; 
  c.fillRect(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
};

// draws a specified piece at a given position
const drawPiece = (piece: piece) => (position: complex):void => {
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

const updatePiece = (piece: piece) => (transformation: Transformation):piece => (
  {colour: piece.colour, shape: piece.shape.map(transformation)}
  );

drawPiece(PIECE.I_PIECE)({x:4, y:4})