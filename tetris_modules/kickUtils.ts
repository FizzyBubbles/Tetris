import { RotationState, KickRotationState, Complex } from "./types";

/**
 *
 * @param prev The previous rotation state
 * @param curr The current rotation state
 */
export const getKickRotationState = (
	prev: RotationState,
	curr: RotationState
): KickRotationState => {
	const { North, East, South, West } = RotationState;
	const { NE, NW, EN, ES, SE, SW, WS, WN } = KickRotationState;
	// returns the respective kick rotation state
	if (prev == North && curr == East) return NE;
	if (prev == North && curr == West) return NW;
	if (prev == East && curr == North) return EN;
	if (prev == East && curr == South) return ES;
	if (prev == South && curr == East) return SE;
	if (prev == South && curr == West) return SW;
	if (prev == West && curr == South) return WS;
	if (prev == West && curr == North) return WN;

	// default (note, this is never used)
	return KickRotationState.WN;
};

/**
 * This maps from the kickRotation state to the test position vectors
 * these are required to find the kick adjustment vector
 */
export const kickTestPositionsMap: Record<KickRotationState, Complex[]> = {
	[KickRotationState.NE]: [
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: -1 },
		{ x: 0, y: 2 },
		{ x: -1, y: 2 }
	],
	[KickRotationState.NW]: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: -1 },
		{ x: 0, y: 2 },
		{ x: 1, y: 2 }
	],
	[KickRotationState.EN]: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: -2 },
		{ x: 1, y: -2 }
	],
	[KickRotationState.ES]: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: -2 },
		{ x: 1, y: -2 }
	],
	[KickRotationState.SE]: [
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: -1 },
		{ x: 0, y: 2 },
		{ x: -1, y: 2 }
	],
	[KickRotationState.SW]: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: 1, y: -1 },
		{ x: 0, y: 2 },
		{ x: 1, y: 2 }
	],
	[KickRotationState.WS]: [
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: 1 },
		{ x: 0, y: -2 },
		{ x: -1, y: -2 }
	],
	[KickRotationState.WN]: [
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: -1, y: 1 },
		{ x: 0, y: -2 },
		{ x: -1, y: -2 }
	]
};

/**
 * This maps from the kickRotation state to the test position vectors
 * these are required to find the kick adjustment vector for the I piece
 */
export const IPieceKickTestPositionsMap: Record<
	KickRotationState,
	Complex[]
> = {
	[KickRotationState.NE]: [
		{ x: 0, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 1 },
		{ x: -1, y: -2 }
	],
	[KickRotationState.NW]: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: -2 },
		{ x: -2, y: 1 }
	],
	[KickRotationState.EN]: [
		{ x: 0, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: -1 },
		{ x: 1, y: 2 }
	],
	[KickRotationState.ES]: [
		{ x: 0, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: -2 },
		{ x: -2, y: 1 }
	],
	[KickRotationState.SE]: [
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 2 },
		{ x: 2, y: -1 }
	],
	[KickRotationState.SW]: [
		{ x: 0, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: 0 },
		{ x: -2, y: -1 },
		{ x: 1, y: 2 }
	],
	[KickRotationState.WS]: [
		{ x: 0, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 1 },
		{ x: -1, y: -2 }
	],
	[KickRotationState.WN]: [
		{ x: 0, y: 0 },
		{ x: -1, y: 0 },
		{ x: 2, y: 0 },
		{ x: -1, y: 2 },
		{ x: 2, y: -1 }
	]
};
