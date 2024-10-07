export class BaseCursor {
  constructor(options) {
    this.options = options || {};
    this.element = this.options.element || document.body;
    this.max_delta_time = this.options.max_delta_time || 0.02;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.cursor = { x: this.width / 2, y: this.height / 2 };
    this.particles = [];
    this.canvas = null;
    this.context = null;
    this.animationFrame = null;
    this.lastTime = 0;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.loop = this.loop.bind(this);

    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    this.init();
  }

  init() {
    if (this.prefersReducedMotion.matches) {
      console.log(
        "This browser has prefers reduced motion turned on, so the cursor did not init"
      );
      return;
    }
    if (typeof null !== "object") throw new TypeError();
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('id', 'tce-canvas');
    this.context = this.canvas.getContext("2d");
    this.canvas.style.position = this.element !== document.body ? "absolute" : "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = this.options.zIndex ?? 100;
    this.canvas.width = this.element.clientWidth || this.width;
    this.canvas.height = this.element.clientHeight || this.height;

    this.element.appendChild(this.canvas);

    this.bindEvents();
    this.loop();
  }
  initializeCursor() {

  }
  bindEvents() {
    window.addEventListener("resize", this.onWindowResize);
    this.element.addEventListener("mousemove", this.initializeCursor.bind(this), {once:true});
    this.element.addEventListener("mousemove", this.onMouseMove);
    this.element.addEventListener("touchmove", this.onTouchMove, {
      passive: true,
    });
    this.element.addEventListener("touchstart", this.onTouchMove, {
      passive: true,
    });
  }

  onWindowResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (newWidth === this.width && newHeight === this.height) return;

    this.width = newWidth;
    this.height = newHeight;

    if (this.element !== document.body) {
      this.canvas.width = this.element.clientWidth;
      this.canvas.height = this.element.clientHeight;
    } else {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  onMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    this.cursor.x = e.clientX - rect.left;
    this.cursor.y = e.clientY - rect.top;
    this.onMove(this.cursor.x, this.cursor.y);
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      const rect = this.element.getBoundingClientRect();
      this.cursor.x = e.touches[0].clientX - rect.left;
      this.cursor.y = e.touches[0].clientY - rect.top;
      this.onMove(this.cursor.x, this.cursor.y);
    }
  }

  onMove(x, y) {

  }

  update(deltaTime) {
    // Implement your drawing logic here
  }

  loop(time) {
    this.animationFrame = requestAnimationFrame(this.loop);

    this.lastTime ??= time;

    let deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;
    deltaTime = Math.min(deltaTime, this.max_delta_time);

    this.update(deltaTime);
  }

  destroy() {
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    window.removeEventListener("resize", this.onWindowResize);
    this.element.removeEventListener("mousemove", this.onMouseMove);
  }
}