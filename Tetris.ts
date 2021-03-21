const CELL = { EMPTY: 0, O_PIECE: 1 , I_PIECE: 2, J_PIECE: 3, L_PIECE: 4, S_PIECE: 5, Z_PIECE: 6, T_PIECE: 7}; // stores all the arbitrary piece values
const COLOURSCHEME = ["#000000", "#ffe100", "#00eeff", "#0000b5", "#de7e00", "#51cb39", "#cd3300", "#y8315c8"]; // stores the colour scheme
const shape = { O_PIECE: [{x:1, y:1}, {x:2, y:1}, {x:2, y:2}, {x:1, y:2}] , I_PIECE: [{x:2, y:0}, {x:2, y:1}, {x:2, y:2}, {x:2, y:3}], J_PIECE: [{x:2, y:0}, {x:2, y:1}, {x:2, y:2}, {x:1, y:2}], L_PIECE: [{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:2, y:2}], S_PIECE: [{x:1, y:1}, {x:1, y:2}, {x:2, y:2}, {x:2, y:3}], Z_PIECE: [{x:2, y:1}, {x:1, y:2}, {x:2, y:2}, {x:1, y:3}], T_PIECE: [{x:1, y:2}, {x:2, y:2}, {x:2, y:3}, {x:3, y:2}]};
let CANVAS = document.getElementById("board");
let c = CANVAS.getContext("2d");

type piece = {
  colour: string;
  shape: complex[];
}

type position = {
  x: number;
  y: number;
};

type GameState = {
  Board: number[][];
};

//complex number
type complex = {
  x: number; // real part
  y: number; // imaginary part
} // complex number

type GameBoard = number[][];

// adds two complex numbers
const add = (n1: complex) => (n2: complex):complex => ({
  x: n1.x + n2.x,

  y: n1.x + n2.x
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
const rotate = (angle: number) => (point: complex):complex => multiply(cis(angle))(point); 

// draw square
const drawSquare =  (position: position) => (colour: string):void => {
  const HEIGHT = CANVAS.clientHeight/20;
  const WIDTH = CANVAS.clientWidth/10;
  c.fillStyle = colour; 
  c.fillxct(position.x * WIDTH, position.y * HEIGHT, WIDTH, HEIGHT);
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



const displayCell = (pos: position) => (size: number) => (colour: any) => {};

drawSquare({ x: 2, y: 0 })(COLOURSCHEME[CELL.O_PIECE]);
