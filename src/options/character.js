import {OptionValue} from "../utils/option-value.js";

export const options = {
	colors: new OptionValue(
		'colorArray',
		[
			"#6622CC",
			"#A755C2",
			"#B07C9E",
			"#B59194",
			"#D2A1B8",
		]
	),
	possibleCharacters: new OptionValue(
		'stringArray',
		["h", "e", "l", "l", "o"]
	),
	cursorOffset: new OptionValue(
		'object',
		{ x: 0, y: 0 }
	),
	font: new OptionValue(
		'string',
		"15px serif"
	)
};