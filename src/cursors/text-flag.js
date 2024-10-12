import { BaseCursor } from "../BaseCursor.js";

export class TextFlag extends BaseCursor {
	constructor(options = {}) {
		super(options);

		this.text = options.text ? " " + options.text : " Your Text Here";
		this.color = options.color || "#000000";
		this.font = options.font || "monospace";
		this.textSize = options.textSize || 12;
		this.gap = options.gap || this.textSize + 2;
		this.angle = 0;
		this.radiusX = 2;
		this.radiusY = 5;
		this.charArray = [];

		this.fontFamily = `${this.textSize}px ${this.font}`;

		for (let i = 0; i < this.text.length; i++) {
			this.charArray[i] = {
				letter: this.text.charAt(i),
				x: this.width / 2,
				y: this.height / 2,
			};
		}
	}

	init() {
		super.init();

		this.context.font = this.fontFamily;
		this.context.textBaseline = "alphabetic";
		this.context.textAlign = "left";
	}

	update(deltaTime) {
		this.context.clearRect(0, 0, this.width, this.height);

		this.angle += 0.15 * deltaTime;
		let locX = this.radiusX * Math.cos(this.angle);
		let locY = this.radiusY * Math.sin(this.angle);

		for (let i = this.charArray.length - 1; i > 0; i--) {
			this.charArray[i].x = this.charArray[i - 1].x + this.gap;
			this.charArray[i].y = this.charArray[i - 1].y;

			this.context.fillStyle = this.color;
			this.context.font = this.fontFamily;
			this.context.fillText(
				this.charArray[i].letter,
				this.charArray[i].x,
				this.charArray[i].y
			);
		}

		let x1 = this.charArray[0].x;
		let y1 = this.charArray[0].y;

		x1 += ((this.cursor.x - x1) / 5 + locX + 2) * deltaTime;
		y1 += ((this.cursor.y - y1) / 5 + locY) * deltaTime;
		this.charArray[0].x = x1;
		this.charArray[0].y = y1;

		this.context.fillStyle = this.color;
		this.context.font = this.fontFamily;
		this.context.fillText(
			this.charArray[0].letter,
			this.charArray[0].x,
			this.charArray[0].y
		);
	}
  
}