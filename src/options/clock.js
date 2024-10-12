import {OptionValue} from "../utils/option-value.js";

export const options = {
	theDays: new OptionValue(
		'stringArray',
		[
			"SUNDAY",
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY",
		]
	),
	theMonths: new OptionValue(
		'stringArray',
		[
			"JANUARY",
			"FEBRUARY",
			"MARCH",
			"APRIL",
			"MAY",
			"JUNE",
			"JULY",
			"AUGUST",
			"SEPTEMBER",
			"OCTOBER",
			"NOVEMBER",
			"DECEMBER",
		]
	),
	time_dilation: new OptionValue(
		'float',
		150
	),
	dateColor: new OptionValue(
		'color',
		'blue'
	),
	faceColor: new OptionValue(
		'color',
		'black'
	),
	secondsColor: new OptionValue(
		'color',
		'red'
	),
	minutesColor: new OptionValue(
		'color',
		'black'
	),
	hoursColor: new OptionValue(
		'color',
		'black'
	),
};