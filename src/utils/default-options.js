import {OptionValue} from "./option-value.js";

export const options = {
	max_delta_time: new OptionValue('float',0.02),
	time_dilation: new OptionValue('float', 100),
	element: new OptionValue('element', document.body),
	zIndex: new OptionValue('int', 1500),
	font: new OptionValue('string',"21px serif"),
	noConstruct: new OptionValue('bool',false),
};