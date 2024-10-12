import { BaseCursor } from '../BaseCursor.js';

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
		this.baseImageSrc =
          options?.baseImageSrc ||
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAYAAACk9eypAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADKADAAQAAAABAAAAEwAAAAAChpcNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABqElEQVQoFY3SPUvDQBgH8BREpRHExYiDgmLFl6WC+AYmWeyLg4i7buJX8DMpOujgyxGvUYeCgzhUQUSKKLUS0+ZyptXh8Z5Ti621ekPyJHl+uftfomhaf9Ei5JyxXKfynyEA6EYcLHpwyflT958GAQ7DTABNHd8EbtDbEH2BD5QEQmi2mM8P/Iq+A0SzszEg+3sPjDnDdVEtQKQbMUidHD3xVzf6A9UDEmEm+8h9KTqTVUjT+vB53aHrCbAPiceYq1dQI1Aqv4EhMll0jzv+Y0yiRgCnLRSYyDQHVoqUXe4uKL9l+L7GXC4vkMhE6eW/AOJs9k583ORDUyXMZ8F5SVHVVnllmPNKSFagAJ5DofaqGXw/gHBYg51dIldkmknY3tguv3jOtHR4+MqAzaraJXbEhqHhcQlwGSOi5pytVQHZLN5s0WNe8HPrLYlFsO20RPHkImxsbmHdLJFI76th7Z4SeuF53hTeFLvhRCJRCTKZKxgdnRDbW+iozFJbBMw14/ElwGYc0egMBMFzT21f5Rog33Z7dX02GBm7WV5ZfT5Nn5bE3zuCDe9UxdTpNvK+5AAAAABJRU5ErkJggg==";
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