import { BaseCursor } from './BaseCursor.js';

export class BubbleCursor extends BaseCursor {
  constructor(options) {
    super(options);
    this.particles = [];
    this.lastTime = 0;
  }

  bindEvents() {
    super.bindEvents();
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.element.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true,
    });
    this.element.addEventListener("touchstart", this.onTouchMove.bind(this), {
      passive: true,
    });
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  destroy() {
    super.destroy();
    this.element.removeEventListener("touchmove", this.onTouchMove.bind(this));
    this.element.removeEventListener("touchstart", this.onTouchMove.bind(this));
    window.removeEventListener("resize", this.onWindowResize.bind(this));
  }

  onMouseMove(e) {
    super.onMouseMove(e);
    this.addParticle(this.cursor.x, this.cursor.y);
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        const x = e.touches[i].clientX;
        const y = e.touches[i].clientY;
        this.addParticle(x, y);
      }
    }
  }

  addParticle(x, y) {
    this.particles.push(new Particle(x, y));
  }

  update(deltaTime) {
    if (this.particles.length === 0) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.context, deltaTime);
    }

    // Remove dead particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].lifeSpan < 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length === 0) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

class Particle {
  constructor(x, y) {
    const lifeSpan = Math.floor(Math.random() * 60 + 60);
    this.initialLifeSpan = lifeSpan;
    this.lifeSpan = lifeSpan; // frames
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
      y: -0.4 + Math.random() * -1,
    };
    this.position = { x: x, y: y };
    this.baseDimension = 4;
  }

  update(context, deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75 * deltaTime;
    this.velocity.y -= (Math.random() / 600) * deltaTime;
    this.lifeSpan -= deltaTime;
    const scale =
      0.2 + (this.initialLifeSpan - this.lifeSpan) / this.initialLifeSpan;

    context.fillStyle = "#e6f1f7";
    context.strokeStyle = "#3a92c5";
    context.beginPath();
    context.arc(
      this.position.x - (this.baseDimension / 2) * scale,
      this.position.y - this.baseDimension / 2,
      this.baseDimension * scale,
      0,
      2 * Math.PI
    );

    context.stroke();
    context.fill();

    context.closePath();
  }
}
import { BaseCursor } from './BaseCursor.js';

export class BubbleCursor extends BaseCursor {
  constructor(options) {
    super(options);
    this.particles = [];
    this.lastTime = 0;
  }

  bindEvents() {
    super.bindEvents();
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.element.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true,
    });
    this.element.addEventListener("touchstart", this.onTouchMove.bind(this), {
      passive: true,
    });
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onMouseMove(e) {
    super.onMouseMove(e);
    this.addParticle(this.cursor.x, this.cursor.y);
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        const x = e.touches[i].clientX;
        const y = e.touches[i].clientY;
        this.addParticle(x, y);
      }
    }
  }

  addParticle(x, y) {
    this.particles.push(new Particle(x, y));
  }

  update(deltaTime) {
    if (this.particles.length === 0) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.context, deltaTime);
    }

    // Remove dead particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].lifeSpan < 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length === 0) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  destroy() {
    super.destroy();
    this.element.removeEventListener("touchmove", this.onTouchMove.bind(this));
    this.element.removeEventListener("touchstart", this.onTouchMove.bind(this));
    window.removeEventListener("resize", this.onWindowResize.bind(this));
  }
}

class Particle {
  constructor(x, y) {
    const lifeSpan = Math.floor(Math.random() * 60 + 60);
    this.initialLifeSpan = lifeSpan;
    this.lifeSpan = lifeSpan; // frames
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
      y: -0.4 + Math.random() * -1,
    };
    this.position = { x: x, y: y };
    this.baseDimension = 4;
  }

  update(context, deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75 * deltaTime;
    this.velocity.y -= (Math.random() / 600) * deltaTime;
    this.lifeSpan -= deltaTime;
    const scale =
      0.2 + (this.initialLifeSpan - this.lifeSpan) / this.initialLifeSpan;

    context.fillStyle = "#e6f1f7";
    context.strokeStyle = "#3a92c5";
    context.beginPath();
    context.arc(
      this.position.x - (this.baseDimension / 2) * scale,
      this.position.y - this.baseDimension / 2,
      this.baseDimension * scale,
      0,
      2 * Math.PI
    );

    context.stroke();
    context.fill();

    context.closePath();
  }
}
