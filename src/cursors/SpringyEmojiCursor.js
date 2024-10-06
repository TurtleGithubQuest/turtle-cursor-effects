import { BaseCursor } from './BaseCursor.js';

export class SpringyEmojiCursor extends BaseCursor {
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
    // Save emoji as an image for performance
    this.context.font = "16px serif";
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";

    let measurements = this.context.measureText(this.emoji);
    let bgCanvas = document.createElement("canvas");
    let bgContext = bgCanvas.getContext("2d");

    bgCanvas.width = measurements.width;
    bgCanvas.height = measurements.actualBoundingBoxAscent * 2;

    bgContext.textAlign = "center";
    bgContext.font = "16px serif";
    bgContext.textBaseline = "middle";
    bgContext.fillText(
      this.emoji,
      bgCanvas.width / 2,
      measurements.actualBoundingBoxAscent
    );

    this.emojiAsImage = bgCanvas;

    for (let i = 0; i < this.nDots; i++) {
      this.particles[i] = new Particle(this.emojiAsImage);
    }
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
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.cursor.x = e.touches[0].clientX;
      this.cursor.y = e.touches[0].clientY;
    }
  }

  update(deltaTime) {
    this.canvas.width = this.canvas.width;

    // follow mouse
    this.particles[0].position.x = this.cursor.x;
    this.particles[0].position.y = this.cursor.y;

    // Start from 2nd dot
    for (let i = 1; i < this.nDots; i++) {
      let spring = new Vec(0, 0);

      if (i > 0) {
        this.springForce(i - 1, i, spring);
      }

      if (i < this.nDots - 1) {
        this.springForce(i + 1, i, spring);
      }

      let resist = new Vec(
        -this.particles[i].velocity.x * this.RESISTANCE,
        -this.particles[i].velocity.y * this.RESISTANCE
      );

      let accel = new Vec(
        (spring.X + resist.X) / this.MASS,
        (spring.Y + resist.Y) / this.MASS + this.GRAVITY
      );

      this.particles[i].velocity.x +=
        this.DELTAT * accel.X * deltaTime;
      this.particles[i].velocity.y +=
        this.DELTAT * accel.Y * deltaTime;

      if (
        Math.abs(this.particles[i].velocity.x) < this.STOPVEL &&
        Math.abs(this.particles[i].velocity.y) < this.STOPVEL &&
        Math.abs(accel.X) < this.STOPACC &&
        Math.abs(accel.Y) < this.STOPACC
      ) {
        this.particles[i].velocity.x = 0;
        this.particles[i].velocity.y = 0;
      }

      this.particles[i].position.x +=
        this.particles[i].velocity.x * deltaTime;
      this.particles[i].position.y +=
        this.particles[i].velocity.y * deltaTime;

      let height = this.canvas.clientHeight;
      let width = this.canvas.clientWidth;

      if (this.particles[i].position.y >= height - this.DOTSIZE - 1) {
        if (this.particles[i].velocity.y > 0) {
          this.particles[i].velocity.y = this.BOUNCE * -this.particles[i].velocity.y;
        }
        this.particles[i].position.y = height - this.DOTSIZE - 1;
      }

      if (this.particles[i].position.x >= width - this.DOTSIZE) {
        if (this.particles[i].velocity.x > 0) {
          this.particles[i].velocity.x = this.BOUNCE * -this.particles[i].velocity.x;
        }
        this.particles[i].position.x = width - this.DOTSIZE - 1;
      }

      if (this.particles[i].position.x < 0) {
        if (this.particles[i].velocity.x < 0) {
          this.particles[i].velocity.x = this.BOUNCE * -this.particles[i].velocity.x;
        }
        this.particles[i].position.x = 0;
      }

      this.particles[i].draw(this.context);
    }
  }

  springForce(i, j, spring) {
    let dx = this.particles[i].position.x - this.particles[j].position.x;
    let dy = this.particles[i].position.y - this.particles[j].position.y;
    let len = Math.sqrt(dx * dx + dy * dy);
    if (len > this.SEGLEN) {
      let springF = this.SPRINGK * (len - this.SEGLEN);
      spring.X += (dx / len) * springF;
      spring.Y += (dy / len) * springF;
    }
  }
}

class Vec {
  constructor(X, Y) {
    this.X = X;
    this.Y = Y;
  }
}

class Particle {
  constructor(canvasItem) {
    this.position = { x: 0, y: 0 };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.canv = canvasItem;
  }

  draw(context) {
    context.drawImage(
      this.canv,
      this.position.x - this.canv.width / 2,
      this.position.y - this.canv.height / 2,
      this.canv.width,
      this.canv.height
    );
  }
}
