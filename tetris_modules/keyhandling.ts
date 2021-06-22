import { tetrisStore } from "../Tetris";

var currentKeyDown = {
	left: false,
	right: false,
	rotateClockwise: false,
	rotateAntiClockwise: false,
	softDrop: false,
	hardDrop: false,
	hold: false,
	reset: false,
	pause: false
};

var moveRightTimeDelay: NodeJS.Timeout;
var moveRightLoop: NodeJS.Timeout;
var moveLeftTimeDelay: NodeJS.Timeout;
var moveLeftLoop: NodeJS.Timeout;
var softDropLoop: NodeJS.Timeout;

// Key Press Input
export const keydown = (document.onkeydown = e => {
	const keyBinds = tetrisStore.state.settings.keyBindings; // sets the keybindings to the states current keybindings
	const currentKey = e.which; // more meaningful name;
	const ARR = {
		delay: tetrisStore.state.settings.autoRepeat.delayMS,
		rate: tetrisStore.state.settings.autoRepeat.rateMS
	};

	if (keyBinds.left.includes(currentKey) && !currentKeyDown.left) {
		tetrisStore.dispatch("MOVE-LEFT");
		moveLeftTimeDelay = setTimeout(
			() =>
				(moveLeftLoop = setInterval(
					() => tetrisStore.dispatch("MOVE-LEFT"),
					ARR.rate
				)),
			ARR.delay
		);
		currentKeyDown.left = true;
	}

	if (keyBinds.right.includes(currentKey) && !currentKeyDown.right) {
		currentKeyDown.right = true;
		tetrisStore.dispatch("MOVE-RIGHT");
		moveRightTimeDelay = setTimeout(
			() =>
				(moveRightLoop = setInterval(
					() => tetrisStore.dispatch("MOVE-RIGHT"),
					ARR.rate
				)),
			ARR.delay
		);
	}

	if (
		keyBinds.rotateClockwise.includes(currentKey) &&
		!currentKeyDown.rotateClockwise
	) {
		currentKeyDown.rotateClockwise = true;
		tetrisStore.dispatch("ROTATE-CLOCKWISE");
	}

	if (
		keyBinds.rotateAntiClockwise.includes(currentKey) &&
		!currentKeyDown.rotateAntiClockwise
	) {
		currentKeyDown.rotateAntiClockwise = true;
		tetrisStore.dispatch("ROTATE-ANTICLOCKWISE");
	}

	if (keyBinds.softDrop.includes(currentKey) && !currentKeyDown.softDrop) {
		currentKeyDown.softDrop = true;
		tetrisStore.dispatch("SOFT-DROP");
		softDropLoop = setInterval(() => tetrisStore.dispatch("SOFT-DROP"), 35);
	}

	if (keyBinds.hardDrop.includes(currentKey) && !currentKeyDown.hardDrop) {
		currentKeyDown.hardDrop = true;
		tetrisStore.dispatch("HARD-DROP");
	}

	if (keyBinds.hold.includes(currentKey) && !currentKeyDown.hold) {
		currentKeyDown.hold = true;
		tetrisStore.dispatch("HOLD");
	}

	if (keyBinds.reset.includes(currentKey) && !currentKeyDown.reset) {
		currentKeyDown.reset = true;
		tetrisStore.dispatch("RESET");
	}

	if (keyBinds.pause.includes(currentKey) && !currentKeyDown.pause) {
		currentKeyDown.pause = true;
		tetrisStore.dispatch("PAUSE");
	}

	tetrisStore.dispatch("EXIT-FAIL"); // any key press will attempt to leave the fail screen
});
export const keyup = (document.onkeyup = e => {
	const keyBinds = tetrisStore.state.settings.keyBindings; // sets the keybindings to the states current keybindings
	const currentKey = e.which; // more meaningful name;

	if (keyBinds.left.includes(currentKey) && currentKeyDown.left) {
		currentKeyDown.left = false;
		clearTimeout(moveLeftTimeDelay);
		clearInterval(moveLeftLoop);
	}

	if (keyBinds.right.includes(currentKey) && currentKeyDown.right) {
		currentKeyDown.right = false;
		clearTimeout(moveRightTimeDelay);
		clearInterval(moveRightLoop);
	}

	if (
		keyBinds.rotateClockwise.includes(currentKey) &&
		currentKeyDown.rotateClockwise
	) {
		currentKeyDown.rotateClockwise = false;
	}

	if (
		keyBinds.rotateAntiClockwise.includes(currentKey) &&
		currentKeyDown.rotateAntiClockwise
	) {
		currentKeyDown.rotateAntiClockwise = false;
	}

	if (keyBinds.softDrop.includes(currentKey) && currentKeyDown.softDrop) {
		currentKeyDown.softDrop = false;
		clearInterval(softDropLoop);
	}

	if (keyBinds.hardDrop.includes(currentKey) && currentKeyDown.hardDrop) {
		currentKeyDown.hardDrop = false;
	}

	if (keyBinds.hold.includes(currentKey) && !currentKeyDown.hold) {
		currentKeyDown.hold = false;
	}

	if (keyBinds.reset.includes(currentKey) && currentKeyDown.reset) {
		currentKeyDown.reset = false;
	}

	if (keyBinds.pause.includes(currentKey) && currentKeyDown.pause) {
		currentKeyDown.pause = false;
	}

	tetrisStore.dispatch("EXIT-FAIL"); // any key press will attempt to leave the fail screen
});
