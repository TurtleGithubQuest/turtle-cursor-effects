import { BaseCursor } from '../utils/base-cursor.js';
import {interpolateColors} from "../utils/color.js";
import { options as followingDotOptions } from '../options/following-dot.js';

export class FollowingDot extends BaseCursor {

	init() {
		super.init();

		this.colors = Array.isArray(this.colors) ? this.colors : [this.color];
		this.colorIndex = 0;
		this.colorProgress = 0;
		this.colorTransitionSpeed = (this.colorTransitionSpeed)/100;

		this.dot = new Dot(
			this.width / 2,
			this.height / 2,
			this.size,
			this.lag,
			this.colors[0]
		);
	}
	static getOptions() {return followingDotOptions;}
	update(deltaTime) {
		this.context.clearRect(0, 0, this.width, this.height);

		if (this.colors.length > 1) {
			this.updateDotColor(deltaTime);
		}

		this.dot.moveTowards(this.cursor.x, this.cursor.y, deltaTime);
		this.dot.draw(this.context);
	}

	updateDotColor(deltaTime) {
		this.colorProgress += this.colorTransitionSpeed * deltaTime;

		if (this.colorProgress >= 1) {
			this.colorProgress = 0;
			this.colorIndex = (this.colorIndex + 1) % this.colors.length;
		}

		const currentColor = this.colors[this.colorIndex];
		const nextColor = this.colors[(this.colorIndex + 1) % this.colors.length];

		this.dot.color = interpolateColors(currentColor, nextColor, this.colorProgress);
	}
}

class Dot {
	constructor(x, y, width, lag, color, rect) {
		this.position = { x: x, y: y };
		this.width = width;
		this.lag = lag;
		this.color = color;
		this.rect = rect;
	}

	moveTowards(x, y, deltaTime) {
		this.position.x += (x - this.position.x) / (this.lag / deltaTime);
		this.position.y += (y - this.position.y) / (this.lag / deltaTime);
	}

	draw(context) {
		context.fillStyle = this.color;
		context.beginPath();
		if (this.rect) {
			context.rect(this.position.x, this.position.y, this.width, this.width);
		} else {
			context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI);
		}
		context.fill();
		context.closePath();
	}
}
