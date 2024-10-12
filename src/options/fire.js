import {OptionValue} from "../utils/option-value.js";

export const options = {
	maxParticles: new OptionValue('int', 300),
	emissionRate: new OptionValue('int', 5),
	particleSize: new OptionValue('int', 5),
	time_dilation: new OptionValue('float', 1.5),
	particleLifetime: new OptionValue('float', .5),
	gravity: new OptionValue('float', -40),
	colors: new OptionValue('colorArray',
		[
			{ r: 255, g: 220, b: 0 },
			{ r: 255, g: 165, b: 0 },
			{ r: 255, g: 85, b: 0 },
			{ r: 255, g: 0, b: 0 },
		]
	)
};