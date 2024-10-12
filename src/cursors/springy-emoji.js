import { BaseCursor } from '../utils/base-cursor.js';
import {options as springyEmojiOptions} from "../options/springy-emoji.js";

export class SpringyEmoji extends BaseCursor {
	constructor(options) {
		super(options);
		this.particles = [];

		this.initEmoji();
	}

	static getOptions() {return springyEmojiOptions;}

	initEmoji() {
		const emojiArray = this.emoji;
		const emojiCanvasArray = emojiArray.map(emoji => {
			const emojiCanvas = document.createElement('canvas');
			const context = emojiCanvas.getContext('2d');
			context.font = this.font;
			context.textBaseline = 'middle';
			context.textAlign = 'center';

			const measurements = context.measureText(emoji);
			const ascent = measurements.actualBoundingBoxAscent || 16;

			emojiCanvas.width = measurements.width;
			emojiCanvas.height = ascent * 2;

			const emojiContext = emojiCanvas.getContext('2d');
			emojiContext.font = this.font;
			emojiContext.textBaseline = 'middle';
			emojiContext.textAlign = 'center';

			emojiContext.fillText(emoji, emojiCanvas.width / 2, ascent);

			return emojiCanvas;
		});

		for (let i = 0; i < emojiArray.length; i++) {
			this.particles.push(new Particle(emojiCanvasArray[i]));
		}
	}

	update(deltaTime) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const firstParticle = this.particles[0];
		if (!firstParticle) return;

		firstParticle.position.x = this.cursor.x;
		firstParticle.position.y = this.cursor.y;

		const particleCount = this.particles.length;
		const height = this.canvas.clientHeight;
		const width = this.canvas.clientWidth;

		for (let i = 1; i < particleCount; i++) {
			const particle = this.particles[i];
			const prevParticle = this.particles[i - 1];
			const nextParticle = this.particles[i + 1];
			const spring = { x: 0, y: 0 };

			this.applySpringForce(prevParticle, particle, spring);

			if (nextParticle) {
				this.applySpringForce(nextParticle, particle, spring);
			}

			const resistX = -particle.velocity.x * this.resistance;
			const resistY = -particle.velocity.y * this.resistance;

			const accelX = (spring.x + resistX) / this.mass;
			const accelY = (spring.y + resistY) / this.mass + this.gravity;

			particle.velocity.x += this.deltaT * accelX * deltaTime;
			particle.velocity.y += this.deltaT * accelY * deltaTime;

			if (
				Math.abs(particle.velocity.x) < this.stopVel &&
                Math.abs(particle.velocity.y) < this.stopVel &&
                Math.abs(accelX) < this.stopAcc &&
                Math.abs(accelY) < this.stopAcc
			) {
				particle.velocity.x = 0;
				particle.velocity.y = 0;
			}

			particle.position.x += particle.velocity.x * deltaTime;
			particle.position.y += particle.velocity.y * deltaTime;

			this.handleBoundaries(particle, width, height);

			particle.draw(this.context);
		}

		firstParticle.draw(this.context);
	}

	applySpringForce(particleA, particleB, spring) {
		const dx = particleA.position.x - particleB.position.x;
		const dy = particleA.position.y - particleB.position.y;
		const len = Math.hypot(dx, dy);

		if (len > this.segLen) {
			const springF = this.springK * (len - this.segLen);
			spring.x += (dx / len) * springF;
			spring.y += (dy / len) * springF;
		}
	}

	handleBoundaries(particle, width, height) {
		const DOTSIZE = this.dotSize;
		const BOUNCE = this.bounce;

		if (particle.position.y >= height - DOTSIZE - 1) {
			if (particle.velocity.y > 0) {
				particle.velocity.y = -BOUNCE * particle.velocity.y;
			}
			particle.position.y = height - DOTSIZE - 1;
		}

		if (particle.position.x >= width - DOTSIZE) {
			if (particle.velocity.x > 0) {
				particle.velocity.x = -BOUNCE * particle.velocity.x;
			}
			particle.position.x = width - DOTSIZE - 1;
		}

		if (particle.position.x < 0) {
			if (particle.velocity.x < 0) {
				particle.velocity.x = -BOUNCE * particle.velocity.x;
			}
			particle.position.x = 0;
		}
	}
}

class Particle {
	constructor(image) {
		this.position = { x: 0, y: 0 };
		this.velocity = { x: 0, y: 0 };
		this.image = image;
	}

	draw(context) {
		context.drawImage(
			this.image,
			this.position.x - this.image.width / 2,
			this.position.y - this.image.height / 2,
			this.image.width,
			this.image.height
		);
	}
}