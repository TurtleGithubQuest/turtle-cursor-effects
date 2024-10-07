import { BaseCursor } from '../BaseCursor.js';

export class SpringyEmoji extends BaseCursor {
  constructor(options) {
    super(options);
    this.emoji = (options && options.emoji) || "🤪";
    this.nDots = 7;
    this.DELTAT = 0.01;
    this.SEGLEN = 10;
    this.SPRINGK = 10;
    this.MASS = 1;
    this.GRAVITY = 50;
    this.RESISTANCE = 10;
    this.STOPVEL = 0.1;
    this.STOPACC = 0.1;
    this.DOTSIZE = 11;
    this.BOUNCE = 0.7;
    this.particles = [];
    this.emojiAsImage = null;

    this.initEmoji();
  }

  initEmoji() {
    const emojiCanvas = document.createElement('canvas');
    const context = emojiCanvas.getContext('2d');

    context.font = '16px serif';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    const measurements = context.measureText(this.emoji);
    const ascent = measurements.actualBoundingBoxAscent || 16;

    emojiCanvas.width = measurements.width;
    emojiCanvas.height = ascent * 2;

    const emojiContext = emojiCanvas.getContext('2d');
    emojiContext.font = '16px serif';
    emojiContext.textBaseline = 'middle';
    emojiContext.textAlign = 'center';

    emojiContext.fillText(this.emoji, emojiCanvas.width / 2, ascent);

    this.emojiAsImage = emojiCanvas;

    for (let i = 0; i < this.nDots; i++) {
      this.particles.push(new Particle(this.emojiAsImage));
    }
  }

  update(deltaTime) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    deltaTime *= 100;

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

      const resistX = -particle.velocity.x * this.RESISTANCE;
      const resistY = -particle.velocity.y * this.RESISTANCE;

      const accelX = (spring.x + resistX) / this.MASS;
      const accelY = (spring.y + resistY) / this.MASS + this.GRAVITY;

      particle.velocity.x += this.DELTAT * accelX * deltaTime;
      particle.velocity.y += this.DELTAT * accelY * deltaTime;

      if (
        Math.abs(particle.velocity.x) < this.STOPVEL &&
        Math.abs(particle.velocity.y) < this.STOPVEL &&
        Math.abs(accelX) < this.STOPACC &&
        Math.abs(accelY) < this.STOPACC
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

    if (len > this.SEGLEN) {
      const springF = this.SPRINGK * (len - this.SEGLEN);
      spring.x += (dx / len) * springF;
      spring.y += (dy / len) * springF;
    }
  }

  handleBoundaries(particle, width, height) {
    const DOTSIZE = this.DOTSIZE;
    const BOUNCE = this.BOUNCE;

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