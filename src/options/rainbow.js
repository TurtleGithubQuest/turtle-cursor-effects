import {OptionValue} from "../utils/option-value.js";

export const options = {
	colors: new OptionValue('colorArray',
		[
			"#FE0000",
			"#FD8C00",
			"#FFE500",
			"#119F0B",
			"#0644B3",
			"#C22EDC",
		]
	),
	size: new OptionValue('float', 3),
	particleCount: new OptionValue('float', 750),
	particleLifespan: new OptionValue('float', .25),
	particleSpacing: new OptionValue('int', 1)
};