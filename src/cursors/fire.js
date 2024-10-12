import { BaseCursor } from '../utils/base-cursor.js';
import { options as fireOptions } from '../options/fire.js';

export class Fire extends BaseCursor {
	constructor(options = {}) {
		super(options);

		this.particles = [];

		this.context.globalCompositeOperation = 'lighter';
		this.context.filter = 'blur(2px)';

		this.prevCursorX = this.cursor.x;
		this.prevCursorY = this.cursor.y;
	}

	static getOptions() {return fireOptions;}

	onMove(x, y) {
		const dx = x - (this.prevCursorX || x);
		const dy = y - (this.prevCursorY || y);
		const speed = Math.hypot(dx, dy);
		const emission = Math.min(Math.floor(speed / 2), this.emissionRate);

		for (let i = 0; i < emission; i++) {
			this.addParticle(x, y);
		}

		this.prevCursorX = x;
		this.prevCursorY = y;
	}

	addParticle(x, y) {
		if (this.particles.length >= this.maxParticles) {
			this.particles.splice(0, this.particles.length - this.maxParticles);
		}

		const particle = new Particle(x, y, this);
		this.particles.push(particle);
	}

	update(deltaTime) {
		if (this.particles.length === 0) {
			return;
		}

		this.context.clearRect(0, 0, this.width, this.height);

		for (let i = this.particles.length - 1; i >= 0; i--) {
			const particle = this.particles[i];
			particle.update(deltaTime);
			particle.draw(this.context);

			if (particle.lifeSpan <= 0) {
				this.particles.splice(i, 1);
			}
		}
	}
}

class Particle {
	constructor(x, y, parent) {
		this.parent = parent;
		this.position = { x, y };
		this.velocity = {
			x: (Math.random() - 0.5) * 30,
			y: -(Math.random() * 50 + 50),
		};
		this.size = parent.particleSize + Math.random() * 5;
		this.lifeSpan = parent.particleLifetime;
		this.age = 0;
		this.color = { ...parent.colors[0] };
	}

	update(deltaTime) {
		this.age += deltaTime;
		this.lifeSpan -= deltaTime;

		this.position.x += this.velocity.x * deltaTime;
		this.position.y += this.velocity.y * deltaTime;

		this.velocity.y += this.parent.gravity * deltaTime;

		this.velocity.x += (Math.random() - 0.5) * 60 * deltaTime;

		const lifeRatio = this.age / this.parent.particleLifetime;
		const colorIndex = Math.floor(lifeRatio * (this.parent.colors.length - 1));
		const colorProgress = (lifeRatio * (this.parent.colors.length - 1)) % 1;

		const startColor = this.parent.colors[colorIndex];
		const endColor =
            this.parent.colors[colorIndex + 1] || this.parent.colors[this.parent.colors.length - 1];

		this.color = {
			r: startColor.r + (endColor.r - startColor.r) * colorProgress,
			g: startColor.g + (endColor.g - startColor.g) * colorProgress,
			b: startColor.b + (endColor.b - startColor.b) * colorProgress,
		};

		if (lifeRatio < 0.5) {
			this.size *= 1 + deltaTime * 2;
		} else {
			this.size *= 1 - deltaTime * 2;
		}

		this.size = Math.max(this.size, 0.1);
	}

	draw(context) {
		context.save();

		const alpha = Math.max(this.lifeSpan / this.parent.particleLifetime, 0);
		const color = `rgba(${Math.round(this.color.r)}, ${Math.round(this.color.g)}, ${Math.round(
			this.color.b
		)}, ${alpha})`;

		context.fillStyle = color;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
		context.fill();

		context.restore();
	}
}