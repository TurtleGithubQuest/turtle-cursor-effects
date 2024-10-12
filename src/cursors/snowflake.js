import { BaseCursor } from '../utils/base-cursor.js';
import { options as snowflakeOptions } from '../options/snowflake.js';

export class Snowflake extends BaseCursor {
	constructor(options = {}) {
		super(options);

		this.canvImages = [];
		this.lastTime = 0;

		this.initCanvImages();
	}

	static getOptions() {return snowflakeOptions;}

	init() {
		super.init();

		this.context.font = this.font;
		this.context.textBaseline = "middle";
		this.context.textAlign = "center";
	}

	initCanvImages() {
		this.canvImages = [];

		this.emoji.forEach((emoji) => {
			const tempCanvas = document.createElement("canvas");
			const tempContext = tempCanvas.getContext("2d");
			tempContext.font = this.font;
			tempContext.textBaseline = "middle";
			tempContext.textAlign = "center";

			const measurements = tempContext.measureText(emoji);

			tempCanvas.width = measurements.width;
			tempCanvas.height = measurements.actualBoundingBoxAscent * 2;

			tempContext.font = this.font;
			tempContext.textBaseline = "middle";
			tempContext.textAlign = "center";

			tempContext.fillText(
				emoji,
				tempCanvas.width / 2,
				measurements.actualBoundingBoxAscent
			);

			this.canvImages.push(tempCanvas);
		});
	}

	onMove(x, y) {
		const idx = Math.floor(Math.random() * this.canvImages.length);
		const img = this.canvImages[idx];
		this.addParticle(x, y, img);
	}

	onTouchMove(e) {
		if (e.touches.length > 0) {
			for (let i = 0; i < e.touches.length; i++) {
				this.addParticle(
					e.touches[i].clientX,
					e.touches[i].clientY,
					this.canvImages[Math.floor(Math.random() * this.canvImages.length)]
				);
			}
		}
	}

	addParticle(x, y, img) {
		this.particles.push(new Particle(x, y, img));
	}

	update(deltaTime) {
		if (this.particles.length === 0) {
			return;
		}

		this.context.clearRect(0, 0, this.width, this.height);

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].update(this.context, deltaTime);
		}

		for (let i = this.particles.length - 1; i >= 0; i--) {
			if (this.particles[i].lifeSpan < 0) {
				this.particles.splice(i, 1);
			}
		}
	}

}

class Particle {
	constructor(x, y, canvasItem) {
		const lifeSpan = Math.floor(Math.random() * 60 + 80);
		this.initialLifeSpan = lifeSpan;
		this.lifeSpan = lifeSpan;
		this.velocity = {
			x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
			y: 1 + Math.random(),
		};
		this.position = { x: x, y: y };
		this.canv = canvasItem;
	}

	update(context, deltaTime) {
		this.position.x += this.velocity.x * deltaTime;
		this.position.y += this.velocity.y * deltaTime;
		this.lifeSpan -= deltaTime;

		this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75 * deltaTime;
		this.velocity.y -= Math.random() / (300 * deltaTime);

		const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

		const degrees = 2 * this.lifeSpan;
		const radians = degrees * 0.0174533; // Degrees to radians

		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(radians);

		context.drawImage(
			this.canv,
			(-this.canv.width / 2) * scale,
			-this.canv.height / 2,
			this.canv.width * scale,
			this.canv.height * scale
		);

		context.restore();
	}
}