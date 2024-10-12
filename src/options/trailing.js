import {OptionValue} from "../utils/option-value.js";
import {cursor as cursorBody} from "../images/trailing/cursor.js";

export const options = {
	rate: new OptionValue('float', .4),
	particleCount: new OptionValue('int', 15),
	ghost: new OptionValue('bool', false),
	randomDelay: new OptionValue('bool', false),
	minDelay: new OptionValue('int', 100),
	maxDelay: new OptionValue('int', 500),
	lifeSpan: new OptionValue('int', 400),
	baseImageSrc: new OptionValue('image', cursorBody),
};