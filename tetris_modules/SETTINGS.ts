import { AutoRepeatSettings, Settings } from "./types";

export const tomKEYBINDINGS = {
	left: [85],
	right: [48],
	rotateClockwise: [70],
	rotateAntiClockwise: [83],
	softDrop: [57],
	hardDrop: [32],
	hold: [68],
	reset: [82],
	pause: [27]
}; // the best keybindings

export const KEYBINDINGS = {
	left: [37],
	right: [39],
	rotateClockwise: [88, 38],
	rotateAntiClockwise: [17, 90],
	softDrop: [40],
	hardDrop: [32],
	hold: [67, 16],
	reset: [82],
	pause: [27]
}; // lame bad keybindings for beta children

export const defaultARR: AutoRepeatSettings = {
	rateMS: 75,
	delayMS: 100
};

export const DEFAULTSETTINGS: Settings = {
	holdActive: true, // doesn't do anything yet
	randomChoice: "7-BAG", // doesn't do anything yet
	keyBindings: KEYBINDINGS,
	dropShadow: true,
	autoRepeat: defaultARR
}; // default settings

export const FAILSCREENMESSAGES = [
	"YOU ARE DIE",
	"WOW THAT SUCKED!",
	"BRUH",
	"BOB COULDN'T FIX IT",
	"CATASTROPHIC",
	"THAT WAS QUICK",
	"WHAT THE DUCK!",
	"BETTER DUCK NEXT TIME",
	"K.O.",
	"FATALITY",
	"F",
	"BETA GAMER",
	"JUST QUIT ALREADY"
]; // a lil cheeky cheeky
