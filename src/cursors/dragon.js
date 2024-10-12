import { BaseCursor } from '../BaseCursor.js';
import { head as dragonHead } from '../images/dragon/head.js';

export class Dragon extends BaseCursor {
	constructor(options) {
		super(options);

		this.dragonLength = options?.dragonLength || 8;
		this.particleSize = options?.particleSize || 40;
		this.segments = [];
		this.prevCursor = { x: this.cursor.x, y: this.cursor.y };
		this.bodyColor = options?.bodyColor || '#36454F';
		this.headImageSrc = options?.headImageSrc || dragonHead;

		this.headImage = new Image();

		this.imagesLoaded = false;
		this.loadImages().then(() => {
			this.imagesLoaded = true;
			this.initDragon();
			this.loop();
		});
	}

	async loadImages() {
		const loadImage = (img, src) =>
			new Promise((resolve, reject) => {
				img.src = src;
				img.onload = () => resolve();
				img.onerror = reject;
			});

		try {
			await loadImage(this.headImage, this.headImageSrc);
		} catch (error) {
			console.error('Error loading dragon head image:', error);
		}
	}

	initDragon() {
		for (let i = 0; i < this.dragonLength; i++) {
			this.segments.push({
				x: this.cursor.x,
				y: this.cursor.y,
				angle: 0,
			});
		}
	}

	update(deltaTime) {
		if (!this.imagesLoaded) return;

		const head = this.segments[0];
		head.x += (this.cursor.x - head.x) * 0.2;
		head.y += (this.cursor.y - head.y) * 0.2;
		head.angle = Math.atan2(this.cursor.y - head.y, this.cursor.x - head.x);

		for (let i = 1; i < this.segments.length; i++) {
			const prevSegment = this.segments[i - 1];
			const segment = this.segments[i];

			const dx = prevSegment.x - segment.x;
			const dy = prevSegment.y - segment.y;
			const angle = Math.atan2(dy, dx);

			const targetX = prevSegment.x - Math.cos(angle) * this.particleSize * 0.8;
			const targetY = prevSegment.y - Math.sin(angle) * this.particleSize * 0.8;

			segment.x += (targetX - segment.x) * 0.2;
			segment.y += (targetY - segment.y) * 0.2;
			segment.angle = angle;
		}

		this.clearCanvas();

		this.drawDragon();
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawDragon() {
		this.drawTailSegment(this.segments[this.segments.length - 1]);

		for (let i = this.segments.length - 2; i > 0; i--) {
			this.drawBodySegment(this.segments[i]);
		}

		this.drawHeadSegment(this.segments[0]);
	}

	drawHeadSegment(segment) {
		const size = this.particleSize;

		this.context.save();
		this.context.translate(segment.x, segment.y);
		this.context.rotate(segment.angle + Math.PI / 2);

		this.context.drawImage(
			this.headImage,
			-size / 2,
			-size / 2,
			size,
			size
		);

		this.context.restore();
	}

	drawBodySegment(segment) {
		const size = this.particleSize;

		this.context.save();
		this.context.translate(segment.x, segment.y);
		this.context.rotate(segment.angle + Math.PI / 2);

		this.context.fillStyle = this.bodyColor;
		this.context.beginPath();
		this.context.ellipse(0, 0, size / 3, size / 2, 0, 0, Math.PI * 2);
		this.context.fill();

		this.context.restore();
	}

	drawTailSegment(segment) {
		const size = this.particleSize * 0.8;

		this.context.save();
		this.context.translate(segment.x, segment.y);
		this.context.rotate(segment.angle + Math.PI / 2);

		this.context.fillStyle = this.bodyColor;
		this.context.beginPath();
		this.context.ellipse(0, 0, size / 4, size / 2, 0, 0, Math.PI * 2);
		this.context.fill();

		this.context.restore();
	}
}