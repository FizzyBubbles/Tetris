import { cloneDeep } from "lodash";
import { makeStore } from "./tetris_modules/reduxSystem";
import {
	STARTINGPOS,
	TomSettings,
	COLOURSCHEME,
	FAILSCREENMESSAGES
} from "./tetris_modules/constants";
import { add, subtract } from "./tetris_modules/complex";
import { GameState } from "./tetris_modules/types";
import {
	draw,
	drawPieceQueue,
	fillQueue,
	fillHold,
	drawPieceHold,
	drawFailScreen,
	drawPieceDropShadow
} from "./tetris_modules/drawUtils";
import {
	pieceCollided,
	newGameBoard,
	failed,
	calculateWallKickPosition as calculateWallKickDisplacement,
	hardDrop
} from "./tetris_modules/collision";
import { randomPiece, random7Bag } from "./tetris_modules/random";
import {
	down,
	settlePiece,
	moveLeft,
	moveRight,
	rotatePieceAntiClockwise,
	rotatePieceClockwise,
	resetPieceRotation
} from "./tetris_modules/reducerHelpers";

const resetGameState = (HighScore: number): GameState => {
	const firstPiece = randomPiece();
	return cloneDeep({
		queue: random7Bag(),
		cummulativeLineClears: 0,
		level: 0,
		score: 0,
		highScore: HighScore,
		piece: {
			...firstPiece,
			shape: firstPiece.shape.map(subtract(firstPiece.rotationalCentre))
		},
		pos: add(firstPiece.rotationalCentre)(STARTINGPOS),
		board: newGameBoard(10)(20),
		tick: 0,
		paused: false,
		holdPiece: "empty",
		holdFresh: true,
		fail: false,
		failMessage: "FAILED",
		settings: TomSettings
	});
};

type GameAction =
	| "HOLD"
	| "MOVE-LEFT"
	| "MOVE-RIGHT"
	| "SOFT-DROP"
	| "HARD-DROP"
	| "ROTATE-CLOCKWISE"
	| "ROTATE-ANTICLOCKWISE"
	| "PAUSE"
	| "CLOCK-TICK"
	| "RESET"
	| "EXIT-FAIL";

const tetrisReducer = (state: GameState, action: GameAction): GameState => {
	switch (action) {
		case "HOLD": {
			// TODO: figure out what the fuck you are doing here

			if (!state.holdFresh || state.paused || state.fail) return state;

			const nextHold = {
				...resetPieceRotation(state.piece),
				shape: resetPieceRotation(state.piece).shape.map(
					add(state.piece.rotationalCentre)
				)
			};

			if (state.holdPiece == "empty") {
				const nextPiece = state.queue[0];
				const nextQueue = state.queue.slice(1);
				const nextState = {
					...state,
					pos: add(nextPiece.rotationalCentre)(STARTINGPOS),
					holdPiece: nextHold,
					queue: nextQueue,
					piece: {
						...nextPiece,
						shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre))
					},
					holdFresh: false
				};
				return nextState;
			} else {
				const nextPiece = state.holdPiece;
				const nextState = {
					...state,
					pos: add(nextPiece.rotationalCentre)(STARTINGPOS),
					holdPiece: nextHold,
					piece: {
						...nextPiece,
						shape: nextPiece.shape.map(subtract(nextPiece.rotationalCentre))
					},
					holdFresh: false
				};
				return nextState;
			}
		}
		case "MOVE-LEFT": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = moveLeft(state);
			return pieceCollided(newState) ? state : newState;
		}

		case "MOVE-RIGHT": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = moveRight(state);
			return pieceCollided(newState) ? state : newState;
		}

		case "SOFT-DROP": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = { ...state, pos: down(state.pos) };
			if (pieceCollided(newState)) {
				if (failed(newState)) {
					return resetGameState(state.highScore);
				}
				return { ...settlePiece(state), holdFresh: true };
			}
			return newState;
		}

		case "HARD-DROP": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = hardDrop(state);
			if (failed(newState)) {
				return { ...newState, fail: true };
			}
			return { ...settlePiece(newState), holdFresh: true };
		}

		case "ROTATE-ANTICLOCKWISE": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = {
				...state,
				piece: rotatePieceAntiClockwise(state.piece)
			};

			// wallKick returns the displacement a piece has based on some tests or null if it fails all tests
			const wallKickDisplacement = calculateWallKickDisplacement(newState)(
				state.piece.rotationState
			);

			// if no wall kick tests were passed (null) it will not perform the rotation else it will displace the newState by the wallkick
			return wallKickDisplacement == null
				? state
				: { ...newState, pos: add(wallKickDisplacement)(newState.pos) };
		}

		case "ROTATE-CLOCKWISE": {
			if (state.paused || state.fail) return state; // returns state if paused
			const newState = {
				...state,
				piece: rotatePieceClockwise(state.piece)
			};

			// wallKick returns the displacement a piece has based on some tests or null if it fails all tests
			const wallKickDisplacement = calculateWallKickDisplacement(newState)(
				state.piece.rotationState
			);

			// if no wall kick tests were passed (null) it will not perform the rotation else it will displace the newState by the wallkick
			return wallKickDisplacement == null
				? state
				: { ...newState, pos: add(wallKickDisplacement)(newState.pos) };
		}

		case "PAUSE":
			return state.fail ? state : { ...state, paused: !state.paused };

		case "CLOCK-TICK": {
			if (state.paused) return state;
			if (state.fail) {
				return state.tick >= 100
					? {
							...state,
							tick: 0,
							failMessage:
								FAILSCREENMESSAGES[
									Math.floor(Math.random() * FAILSCREENMESSAGES.length)
								]
					  }
					: { ...state, tick: state.tick + 1 };
			}
			const newState = {
				...state,
				pos: down(state.pos),
				tick: 0,
				highScore: state.score > state.highScore ? state.score : state.highScore // changes high score if new high score gained
			};
			if (
				state.tick >=
				10 * Math.pow(0.8 - (state.level - 1) * 0.007, state.level - 1) // speed calculation
			) {
				if (pieceCollided(newState)) {
					if (failed(newState)) {
						return { ...newState, fail: true };
					}
					return { ...settlePiece(state), tick: 0, holdFresh: true };
				}
				return newState;
			}
			return { ...state, tick: state.tick + 1 };
		}

		case "RESET": {
			return resetGameState(state.highScore);
		}
		case "EXIT-FAIL": {
			return state.fail ? resetGameState(state.highScore) : state;
		}
	}
};

const tetrisStore = makeStore(tetrisReducer, resetGameState(0));

export const elementMap = (elementId: string) => (
	elementFunction: (e: HTMLElement) => void
) => {
	const element = document.getElementById(elementId);
	if (!element) return;

	elementFunction(element);
};

const setElementInnerHTML = (elementId: string) => (content: string) => {
	elementMap(elementId)(element => (element.innerHTML = content));
};

const main = () => {
	// listeners
	const drawState = (tetrisState: GameState) => {
		draw(tetrisState); // draws the board
	};
	const writeHighScore = (gameState: GameState): void => {
		setElementInnerHTML("highScore")("High Score: " + gameState.highScore);
	};
	const writeScore = (gameState: GameState): void => {
		setElementInnerHTML("score")("Score: " + gameState.score);
	};
	const writeLevel = (gameState: GameState): void => {
		setElementInnerHTML("level")("Level: " + gameState.level);
	};
	const writeLinesCleared = (gameState: GameState): void => {
		setElementInnerHTML("linesCleared")(
			"Lines Cleared: " + gameState.cummulativeLineClears
		);
	};
	const drawQueue = (gameState: GameState): void => {
		fillQueue(COLOURSCHEME[0]);
		gameState.queue.forEach((piece, queuePlacement) =>
			drawPieceQueue(piece)({ x: 1, y: queuePlacement * 3 + 2 })
		);
	};
	const drawHold = (gameState: GameState): void => {
		fillHold(COLOURSCHEME[0]);
		if (gameState.holdPiece != "empty") {
			drawPieceHold(gameState.holdPiece)({ x: 1, y: 2 });
		}
	};
	const drawFail = (gameState: GameState): void => {
		drawFailScreen(gameState);
	};
	const drawDropShadow = (gameState: GameState): void => {
		if (tetrisStore.state.settings.dropShadow) drawPieceDropShadow(gameState);
	};
	tetrisStore.subscribe(writeHighScore);
	tetrisStore.subscribe(writeScore);
	tetrisStore.subscribe(writeLevel);
	tetrisStore.subscribe(writeLinesCleared);
	tetrisStore.subscribe(drawState);
	tetrisStore.subscribe(drawQueue);
	tetrisStore.subscribe(drawHold);
	tetrisStore.subscribe(drawFail);
	tetrisStore.subscribe(drawDropShadow);
};

const loop = () => {
	tetrisStore.dispatch("CLOCK-TICK");
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);

document.onkeydown = e => {
	const KEYBINDINGS = tetrisStore.state.settings.keyBindings;
	const currentKey = e.which;
	console.log(tetrisStore.state);
	if (KEYBINDINGS.left.includes(currentKey)) tetrisStore.dispatch("MOVE-LEFT");

	if (KEYBINDINGS.right.includes(currentKey))
		tetrisStore.dispatch("MOVE-RIGHT");

	if (KEYBINDINGS.rotateClockwise.includes(currentKey))
		tetrisStore.dispatch("ROTATE-CLOCKWISE");

	if (KEYBINDINGS.rotateAntiClockwise.includes(currentKey))
		tetrisStore.dispatch("ROTATE-ANTICLOCKWISE");

	if (KEYBINDINGS.softDrop.includes(currentKey))
		tetrisStore.dispatch("SOFT-DROP");

	if (KEYBINDINGS.hardDrop.includes(currentKey))
		tetrisStore.dispatch("HARD-DROP");

	if (KEYBINDINGS.hold.includes(currentKey)) tetrisStore.dispatch("HOLD");

	if (KEYBINDINGS.reset.includes(currentKey)) tetrisStore.dispatch("RESET");

	if (KEYBINDINGS.pause.includes(currentKey)) tetrisStore.dispatch("PAUSE");

	tetrisStore.dispatch("EXIT-FAIL");
};

main();
