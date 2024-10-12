import { BaseCursor } from '../utils/base-cursor.js';
import { options as rainbowOptions } from '../options/rainbow.js';

export class Rainbow extends BaseCursor {
	init() {
		super.init();
		this.colors = this.colors.map(hex => this.hexToRGBObject(hex));
		this.particleLifespan = this.particleLifespan * this.time_dilation;
		this.particles = [];
		this.prevCursor = { x: this.cursor.x, y: this.cursor.y };
	}

	static getOptions() {return rainbowOptions;}

	update(deltaTime) {
		this.addInterpolatedParticles(this.prevCursor, this.cursor);

		this.prevCursor.x = this.cursor.x;
		this.prevCursor.y = this.cursor.y;

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = this.particles.length - 1; i >= 0; i--) {
			const particle = this.particles[i];

			particle.update(deltaTime);

			particle.draw(this.context);

			if (particle.lifespan <= 0) {
				this.particles.splice(i, 1);
			}
		}

		const MAX_PARTICLES = this.particleCount;
		if (this.particles.length > MAX_PARTICLES) {
			this.particles.splice(0, this.particles.length - MAX_PARTICLES);
		}
	}

	addInterpolatedParticles(prevPos, currentPos) {
		const dx = currentPos.x - prevPos.x;
		const dy = currentPos.y - prevPos.y;
		const distance = Math.hypot(dx, dy);

		const steps = Math.max(Math.ceil(distance / this.particleSpacing), 1);

		for (let i = 0; i <= steps; i++) {
			const t = i / steps;
			const x = prevPos.x + dx * t;
			const y = prevPos.y + dy * t;
			this.addParticle(x, y);
		}
	}
	hexToRGBObject(hex) {
		const bigint = parseInt(hex.replace('#', ''), 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;

		return { r, g, b };
	}
	addParticle(x, y) {
		this.particles.push(new Particle(x, y, this.colors, this.size, this.particleLifespan));
	}
}
class Particle {
	constructor(x, y, colors, size, lifespan) {
		this.position = { x: x, y: y };
		this.velocity = { x: 0, y: 0 };
		this.colors = colors;
		this.size = size;
		this.age = 0;
		this.lifespan = this.maxLifespan = lifespan;
	}

	update(deltaTime) {
		this.position.x += this.velocity.x * deltaTime;
		this.position.y += this.velocity.y * deltaTime;

		this.lifespan -= deltaTime;
	}

	draw(context) {
		const opacity = Math.max(this.lifespan / this.maxLifespan, 0);

		this.colors.forEach((color, index) => {
			context.beginPath();
			context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
			context.lineWidth = this.size;
			context.lineCap = "round";

			context.moveTo(
				this.position.x,
				this.position.y + index * (this.size - 1)
			);
			context.lineTo(
				this.position.x,
				this.position.y + index * this.size
			);

			context.stroke();
		});
	}
}