import {BaseCursor} from "../BaseCursor.js";

export class FairyDust extends BaseCursor {
	init() {
		super.init();

		this.possibleColors = this.options?.colors || ["#D61C59", "#E7D84B", "#1B8798"];
		this.lastPos = { x: this.width / 2, y: this.height / 2 };
		this.canvImages = [];
		this.char = "*";
		this.context.font = "21px serif";
		this.context.textBaseline = "middle";
		this.context.textAlign = "center";

		this.initCanvImages();
	}

	initCanvImages() {
		this.possibleColors.forEach((color) => {
			let measurements = this.context.measureText(this.char);
			let bgCanvas = document.createElement("canvas");
			let bgContext = bgCanvas.getContext("2d");

			bgCanvas.width = measurements.width;
			bgCanvas.height =
              measurements.actualBoundingBoxAscent +
              measurements.actualBoundingBoxDescent;

			bgContext.fillStyle = color;
			bgContext.textAlign = "center";
			bgContext.font = "21px serif";
			bgContext.textBaseline = "middle";
			bgContext.fillText(
				this.char,
				bgCanvas.width / 2,
				measurements.actualBoundingBoxAscent
			);

			this.canvImages.push(bgCanvas);
		});
	}

	onMove(x, y) {
		const distBetweenPoints = Math.hypot(
			x - this.lastPos.x,
			y - this.lastPos.y
		);

		if (distBetweenPoints > 1.5) {
			const idx = Math.floor(Math.random() * this.canvImages.length);
			this.addParticle(x, y, this.canvImages[idx]);

			this.lastPos.x = x;
			this.lastPos.y = y;
		}
	}

	addParticle(x, y, canvasItem) {
		this.particles.push(new this.Particle(x, y, canvasItem));
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

		if (this.particles.length === 0) {
			this.context.clearRect(0, 0, this.width, this.height);
		}
	}

	Particle = class {
		constructor(x, y, canvasItem) {
			const lifeSpan = Math.floor(Math.random() * 30 + 60);
			this.initialLifeSpan = lifeSpan;
			this.lifeSpan = lifeSpan;
			this.velocity = {
				x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
				y: Math.random() * 0.7 + 0.9,
			};
			this.position = { x: x, y: y };
			this.canv = canvasItem;
		}

		update(context, deltaTime) {
			this.position.x += this.velocity.x * deltaTime;
			this.position.y += this.velocity.y * deltaTime;
			this.lifeSpan -= deltaTime;

			this.velocity.y += 0.02 * deltaTime;

			const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

			context.drawImage(
				this.canv,
				this.position.x - (this.canv.width / 2) * scale,
				this.position.y - this.canv.height / 2,
				this.canv.width * scale,
				this.canv.height * scale
			);
		}
	};

}