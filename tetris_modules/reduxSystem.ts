/**
 *
 * @param reducer function that alters the state given an action
 * @param initialState starting state, this initialises the type of state
 */
export const makeStore = <State, Action>(
	// v v type definitions v v
	reducer: (state: State, action: Action) => State,
	initialState: State
): {
	// v v store methods v v
	state: State;
	dispatch: (action: Action) => void;
	subscribe: (listener: (state: State) => void) => void;
} => {
	// v v v returns store object below v v v

	let state = initialState; // initialises state

	let listeners: ((state: State) => void)[] = []; // initialises listeners

	// adds listener to store's listeners
	const subscribe = (listener: (state: State) => void) => {
		listeners = [...listeners, listener];
	};

	// updates the state given an action
	const dispatch = (action: Action) => {
		// console.log("dispatched action", action);

		// reduces the state into a new state
		const newState = reducer(state, action);

		// sets own state to new state
		state = newState;

		// calls all listeners with new state
		listeners.forEach(listener => listener(state));
	};

	return { state, dispatch, subscribe };
};
