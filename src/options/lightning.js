import {OptionValue} from "../utils/option-value.js";

export const options = {
	color: new OptionValue('color', 'rgba(255, 255, 255, 0.8)'),
	lineWidth: new OptionValue('float', 1),
	lifetime: new OptionValue('float', 3),
	maxSegments: new OptionValue('int', 3),
	maxOffset: new OptionValue('int', 75),
	time_dilation: new OptionValue('float', 1),
	targetSelector: new OptionValue('selector', '*')
};