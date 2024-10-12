import {OptionValue} from "../utils/option-value.js";

export const options = {
	text: new OptionValue('string', 'Save turtles.'),
	color: new OptionValue('color', "#000000"),
	font: new OptionValue('string', "monospace"),
	textSize: new OptionValue('float', 12),
	gap: new OptionValue('float', 14),
};