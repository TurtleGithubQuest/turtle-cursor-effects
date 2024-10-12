import {OptionValue} from "../utils/option-value.js";

export const options = {
	emoji: new OptionValue('stringArray', [
		"🌍",
		"🌑",
		"🪐",
		"☀️",
	]),
	deltaT: new OptionValue('float', .01),
	segLen: new OptionValue('float', 10),
	springK: new OptionValue('float', 10),
	mass: new OptionValue('float', 1),
	gravity: new OptionValue('float', 50),
	resistance: new OptionValue('float', 10),
	stopVel: new OptionValue('float', .1),
	stopAcc: new OptionValue('float', .1),
	dotSize: new OptionValue('float', 11),
	bounce: new OptionValue('float', .7),
};