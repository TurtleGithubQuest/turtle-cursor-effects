import { BaseCursor } from '../BaseCursor.js';

export class Emoji extends BaseCursor {
	constructor(options = {}) {
		super(options);

		this.possibleEmoji = options.emoji || ["😀", "😂", "😆", "😊"];
		this.lastPos = { x: this.width / 2, y: this.height / 2 };
		this.lastTimestamp = 0;
		this.canvImages = [];
		this.font = options.font || "21px serif";

		this.initCanvImages();
	}

	init() {
		super.init();

		this.context.font = this.font;
		this.context.textBaseline = "middle";
		this.context.textAlign = "center";
	}

	initCanvImages() {
		this.canvImages = [];

		this.possibleEmoji.forEach((emoji) => {
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
		const now = performance.now();
		if (now - this.lastTimestamp < 16) {
			return;
		}

		const distBetweenPoints = Math.hypot(
			x - this.lastPos.x,
			y - this.lastPos.y
		);

		if (distBetweenPoints > 1) {
			const idx = Math.floor(Math.random() * this.canvImages.length);
			const img = this.canvImages[idx];
			this.addParticle(x, y, img);

			this.lastPos.x = x;
			this.lastPos.y = y;
			this.lastTimestamp = now;
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
			y: Math.random() * 0.4 + 0.8,
		};
		this.position = { x: x, y: y };
		this.canv = canvasItem;
	}

	update(context, deltaTime) {
		this.position.x += this.velocity.x * deltaTime;
		this.position.y += this.velocity.y * deltaTime;
		this.lifeSpan -= deltaTime;

		this.velocity.y += 0.05 * deltaTime;

		const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

		context.drawImage(
			this.canv,
			this.position.x - (this.canv.width / 2) * scale,
			this.position.y - this.canv.height / 2,
			this.canv.width * scale,
			this.canv.height * scale
		);
	}

}