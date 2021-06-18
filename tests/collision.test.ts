import {
	rowIsFull,
	newGameBoard,
	fullRows,
	hardDrop
} from "./../tetris_modules/collision";
import { CELL } from "./../tetris_modules/constants";
import { GameBoard } from "../tetris_modules/types";

// describe("relative position", () => {
// 	it("should edit the ", relativePos);
// });

describe("newGameBoard", () => {
	it("should return a game board of specified size", () =>
		expect(newGameBoard(2)(3)).toStrictEqual([
			[CELL.EMPTY, CELL.EMPTY],
			[CELL.EMPTY, CELL.EMPTY],
			[CELL.EMPTY, CELL.EMPTY]
		]));
});

describe("rowIsFull", () => {
	it("should return false when row is empty", () =>
		expect(
			rowIsFull([CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY])
		).toStrictEqual(false));

	it("should return true when row is full", () =>
		expect(
			rowIsFull([
				CELL.I_PIECE,
				CELL.I_PIECE,
				CELL.I_PIECE,
				CELL.I_PIECE,
				CELL.J_PIECE
			])
		).toStrictEqual(true));

	it("should return false when row is semi empty", () =>
		expect(
			rowIsFull([
				CELL.I_PIECE,
				CELL.EMPTY,
				CELL.J_PIECE,
				CELL.EMPTY,
				CELL.O_PIECE
			])
		).toStrictEqual(false));
});

describe("fullRows", () => {
	it("should return a list of booleans matching the rowIsFull output", () =>
		expect(
			fullRows([
				[CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY, CELL.EMPTY],
				[CELL.I_PIECE, CELL.I_PIECE, CELL.I_PIECE, CELL.I_PIECE, CELL.J_PIECE],
				[CELL.I_PIECE, CELL.EMPTY, CELL.J_PIECE, CELL.EMPTY, CELL.O_PIECE]
			])
		).toStrictEqual([false, true, false]));
});



describe("hardDrop", () => {
	it("should move piece to the lowest possible position before collision", () =>
		expect(hardDrop({
            "queue": [
                {
                    "id": 6,
                    "name": "Z_PIECE",
                    "colour": "#cd3300",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 1,
                    "name": "O_PIECE",
                    "colour": "#ffe100",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 0.5,
                        "y": -0.5
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "I_PIECE",
                    "colour": "#00eeff",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1.5,
                        "y": -0.5
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        },
                        {
                            "x": 3,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "L_PIECE",
                    "colour": "#de7e00",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": -1
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "Z_PIECE",
                    "colour": "#cd3300",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 7,
                    "name": "T_PIECE",
                    "colour": "#8315c8",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "J_PIECE",
                    "colour": "#0000b5",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "S_PIECE",
                    "colour": "#51cb39",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 2,
                            "y": -1
                        }
                    ]
                },
                {
                    "id": 1,
                    "name": "O_PIECE",
                    "colour": "#ffe100",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 0.5,
                        "y": -0.5
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        }
                    ]
                }
            ],
            "cummulativeLineClears": 0,
            "level": 0,
            "score": 0,
            "piece": {
                "id": 4,
                "name": "L_PIECE",
                "colour": "#de7e00",
                "rotationState": 1,
                "rotationalCentre": {
                    "x": 1,
                    "y": 0
                },
                "shape": [
                    {
                        "x": 0,
                        "y": -1
                    },
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 1
                    },
                    {
                        "x": 1,
                        "y": 1
                    }
                ]
            },
            "pos": {
                "x": 0,
                "y": 5
            },
            "board": [
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    7,
                    2,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    3,
                    3,
                    7,
                    7,
                    2,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    3,
                    1,
                    1,
                    7,
                    2,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    3,
                    1,
                    1,
                    0,
                    2,
                    0,
                    0,
                    0
                ]
            ],
            "tick": 1,
            "paused": false,
            "holdPiece": {
                "id": 5,
                "name": "S_PIECE",
                "colour": "#51cb39",
                "rotationState": 0,
                "rotationalCentre": {
                    "x": 1,
                    "y": 0
                },
                "shape": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": -1
                    },
                    {
                        "x": 2,
                        "y": -1
                    }
                ]
            },
            "holdFresh": true,
            "fail": false,
            "settings": {
                "holdActive": true,
                "randomChoice": "7-BAG",
                "keyBindings": {
                    "left": 85,
                    "right": 48,
                    "rotateClockwise": 70,
                    "rotateAntiClockwise": 83,
                    "softDrop": 57,
                    "hardDrop": 32,
                    "hold": 68,
                    "reset": 82,
                    "pause": 27
                },
                "dropShadow": true
            }
        })).toStrictEqual({
            "queue": [
                {
                    "id": 6,
                    "name": "Z_PIECE",
                    "colour": "#cd3300",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 1,
                    "name": "O_PIECE",
                    "colour": "#ffe100",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 0.5,
                        "y": -0.5
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "I_PIECE",
                    "colour": "#00eeff",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1.5,
                        "y": -0.5
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        },
                        {
                            "x": 3,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "L_PIECE",
                    "colour": "#de7e00",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": -1
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "Z_PIECE",
                    "colour": "#cd3300",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 7,
                    "name": "T_PIECE",
                    "colour": "#8315c8",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "J_PIECE",
                    "colour": "#0000b5",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 2,
                            "y": 0
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "S_PIECE",
                    "colour": "#51cb39",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 1,
                        "y": 0
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        },
                        {
                            "x": 2,
                            "y": -1
                        }
                    ]
                },
                {
                    "id": 1,
                    "name": "O_PIECE",
                    "colour": "#ffe100",
                    "rotationState": 0,
                    "rotationalCentre": {
                        "x": 0.5,
                        "y": -0.5
                    },
                    "shape": [
                        {
                            "x": 0,
                            "y": 0
                        },
                        {
                            "x": 0,
                            "y": -1
                        },
                        {
                            "x": 1,
                            "y": 0
                        },
                        {
                            "x": 1,
                            "y": -1
                        }
                    ]
                }
            ],
            "cummulativeLineClears": 0,
            "level": 0,
            "score": 0,
            "piece": {
                "id": 4,
                "name": "L_PIECE",
                "colour": "#de7e00",
                "rotationState": 1,
                "rotationalCentre": {
                    "x": 1,
                    "y": 0
                },
                "shape": [
                    {
                        "x": 0,
                        "y": -1
                    },
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 1
                    },
                    {
                        "x": 1,
                        "y": 1
                    }
                ]
            },
            "pos": {
                "x": 0,
                "y": 18
            },
            "board": [
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0,
                    0,
                    7,
                    2,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    3,
                    3,
                    7,
                    7,
                    2,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    3,
                    1,
                    1,
                    7,
                    2,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    3,
                    1,
                    1,
                    0,
                    2,
                    0,
                    0,
                    0
                ]
            ],
            "tick": 1,
            "paused": false,
            "holdPiece": {
                "id": 5,
                "name": "S_PIECE",
                "colour": "#51cb39",
                "rotationState": 0,
                "rotationalCentre": {
                    "x": 1,
                    "y": 0
                },
                "shape": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": 0
                    },
                    {
                        "x": 1,
                        "y": -1
                    },
                    {
                        "x": 2,
                        "y": -1
                    }
                ]
            },
            "holdFresh": true,
            "fail": false,
            "settings": {
                "holdActive": true,
                "randomChoice": "7-BAG",
                "keyBindings": {
                    "left": 85,
                    "right": 48,
                    "rotateClockwise": 70,
                    "rotateAntiClockwise": 83,
                    "softDrop": 57,
                    "hardDrop": 32,
                    "hold": 68,
                    "reset": 82,
                    "pause": 27
                },
                "dropShadow": true
            }
        }));
});
