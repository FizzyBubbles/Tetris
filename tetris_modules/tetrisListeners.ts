import { draw } from "./drawUtils";
import { GameState } from "./types";
import {
	setElementInnerHTML,
	fillQueue,
	drawPieceQueue,
	fillHold,
	drawPieceHold,
	drawFailScreen,
	drawGhostPiece
} from "./drawUtils";
import { COLOURSCHEME } from "./constants";
import { tetrisStore } from "../Tetris";

// draws the board
export const drawState = (tetrisState: GameState) => {
	draw(tetrisState);
};

// writes high score
export const writeHighScore = (gameState: GameState): void => {
	setElementInnerHTML("highScore")("High Score: " + gameState.highScore);
};

// writes current score
export const writeScore = (gameState: GameState): void => {
	setElementInnerHTML("score")("Score: " + gameState.score);
};

// writes current level
export const writeLevel = (gameState: GameState): void => {
	setElementInnerHTML("level")("Level: " + gameState.level);
};

// writes current lines cleared
export const writeLinesCleared = (gameState: GameState): void => {
	setElementInnerHTML("linesCleared")(
		"Lines Cleared: " + gameState.cummulativeLineClears
	);
};

// draws queue
export const drawQueue = (gameState: GameState): void => {
	fillQueue(COLOURSCHEME[0]); // clears queue
	gameState.queue.forEach((
		piece,
		queuePlacement // draws each piece at the correct position
	) => drawPieceQueue(piece)({ x: 1, y: queuePlacement * 3 + 2 }));
};

// draws hold
export const drawHold = (gameState: GameState): void => {
	fillHold(COLOURSCHEME[0]); // clears hold
	if (gameState.holdPiece != "empty") {
		drawPieceHold(gameState.holdPiece)({ x: 1, y: 2 });
	}
};

// draws fail screen
export const drawFail = (gameState: GameState): void => {
	drawFailScreen(gameState);
};

// draws drop ghost piece
export const drawGhost = (gameState: GameState): void => {
	if (tetrisStore.state.settings.dropShadow) drawGhostPiece(gameState);
};
