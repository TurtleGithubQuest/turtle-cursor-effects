// BaseCursor.js
export class BaseCursor {
  constructor(options) {
    this.options = options || {};
    this.element = this.options.element || document.body;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.cursor = { x: this.width / 2, y: this.height / 2 };
    this.particles = [];
    this.canvas = null;
    this.context = null;
    this.animationFrame = null;
    this.lastTime = 0;

    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Initialize the cursor effect
    this.init();
  }

  init() {
    if (this.prefersReducedMotion.matches) {
      console.log(
        "This browser has prefers reduced motion turned on, so the cursor did not init"
      );
      return;
    }

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.style.top = "0px";
    this.canvas.style.left = "0px";
    this.canvas.style.pointerEvents = "none";

    if (this.element !== document.body) {
      this.canvas.style.position = "absolute";
      this.element.appendChild(this.canvas);
      this.canvas.width = this.element.clientWidth;
      this.canvas.height = this.element.clientHeight;
    } else {
      this.canvas.style.position = "fixed";
      document.body.appendChild(this.canvas);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.bindEvents();
    this.loop();
  }

  bindEvents() {
    // Stub method to be overridden by subclasses
  }

  onWindowResize(e) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.element !== document.body) {
      this.canvas.width = this.element.clientWidth;
      this.canvas.height = this.element.clientHeight;
    } else {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  onMouseMove(e) {
    if (this.element !== document.body) {
      const boundingRect = this.element.getBoundingClientRect();
      this.cursor.x = e.clientX - boundingRect.left;
      this.cursor.y = e.clientY - boundingRect.top;
    } else {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
    }
  }

  update(deltaTime) {
    // Stub method to be overridden by subclasses
  }

  loop(time) {
    this.animationFrame = requestAnimationFrame(this.loop.bind(this));
    const deltaTime = time ? (time - this.lastTime) / (1000 / 60) : 1;
    this.lastTime = time || 0;
    this.update(deltaTime);
  }

  destroy() {
    this.canvas.remove();
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.onWindowResize.bind(this));
    this.element.removeEventListener("mousemove", this.onMouseMove.bind(this));
  }
}
