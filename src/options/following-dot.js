import {OptionValue} from "../utils/option-value.js";

export const options = {
	colors: new OptionValue(
		'colorArray',
		['red', 'orange', 'blue']
	),
	rect: new OptionValue('bool', false),
	colorTransitionSpeed: new OptionValue('float', 1),
	lag: new OptionValue('float', 5),
	size: new OptionValue('float', 12),
};