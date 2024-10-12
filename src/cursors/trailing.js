import { BaseCursor } from '../BaseCursor.js';
import { cursor as cursorBody } from '../images/trailing/cursor.js';

export class Trailing extends BaseCursor {
	constructor(options) {
		super(options);

		this.totalParticles = options?.particles || 15;
		this.rate = options?.rate || 0.4;
		this.ghost = options?.ghost || false;

		this.randomDelay = options?.randomDelay || false;
		this.minDelay = options?.minDelay || 100;
		this.maxDelay = options?.maxDelay || 500;
		this.lifeSpan = options?.lifeSpan || 400;
		this.baseImageSrc = options?.baseImageSrc || cursorBody;
		this.particles = [];
		this.lastTime = 0;

		this.baseImage = new Image();
		this.baseImage.src = this.baseImageSrc;
	}

	initializeCursor() {
		if (!this.ghost) {
			for (let i = 0; i < this.totalParticles; i++) {
				this.addParticle(this.cursor.x, this.cursor.y, this.baseImage);
			}
		}
	}

	addParticle(x, y, image) {
		this.particles.push(new Particle(x, y, image, this.lifeSpan));
	}

	onMove(x, y) {
		if (this.ghost) {
			const currentTime = Date.now();

			if (this.randomDelay) {
				if (!this.lastTimeParticleAdded || currentTime - this.lastTimeParticleAdded >= this.getDelay()) {
					this.lastTimeParticleAdded = currentTime;
					this.addParticle(x, y, this.baseImage);
				}
			} else {
				this.addParticle(x, y, this.baseImage);
			}
		}
	}

	getDelay() {
		return Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) + this.minDelay;
	}

	update(deltaTime) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.ghost) {
			this.updateGhostParticles(deltaTime);
		} else {
			this.updateTrailingParticles(deltaTime);
		}
	}

	updateGhostParticles(deltaTime) {
		if (this.particles.length === 0) {
			return;
		}

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].updateGhost(this.context, deltaTime);
		}

		for (let i = this.particles.length - 1; i >= 0; i--) {
			if (this.particles[i].lifeSpan <= 0) {
				this.particles.splice(i, 1);
			}
		}
	}

	updateTrailingParticles(deltaTime) {
		let x = this.cursor.x;
		let y = this.cursor.y;

		for (let i = 0; i < this.particles.length; i++) {
			let particle = this.particles[i];
			let nextParticle = this.particles[i + 1] || this.particles[0];

			particle.position.x = x;
			particle.position.y = y;
			particle.draw(this.context);

			x += (nextParticle.position.x - particle.position.x) * this.rate;
			y += (nextParticle.position.y - particle.position.y) * this.rate;
		}
	}
}

class Particle {
	constructor(x, y, image, lifeSpan) {
		this.position = { x: x, y: y };
		this.image = image;
		this.lifeSpan = this.initialLifeSpan = lifeSpan;
	}

	updateGhost(context, deltaTime) {
		this.lifeSpan -= deltaTime * 16.67;
		const opacity = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

		context.save();
		context.globalAlpha = opacity;
		context.drawImage(this.image, this.position.x, this.position.y);
		context.restore();
	}

	draw(context) {
		context.drawImage(this.image, this.position.x, this.position.y);
	}
}