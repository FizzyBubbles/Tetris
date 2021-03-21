const CELL = { EMPTY: 0, O_PIECE: 1 , I_PIECE: 2, J_PIECE: 3, L_PIECE: 4, S_PIECE: 5, Z_PIECE: 6, T_PIECE: 7}; // stores all the arbitrary piece values

let CANVAS = document.getElementById("board");
let c = CANVAS.getContext("2d");



type position = {
  x: number;
  y: number;
};

type GameState = {
  Board: number[][];
};

type GameBoard = number[][];

// draw square
const drawSquare = (colour: string) => (position: position): void => {
  c.fillStyle = colour;
  c.fillRect(position.x, position.y, CANVAS.clientHeight/20, CANVAS.clientWidth/10 );
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

drawSquare("black")({ x: 0, y: 0 });
