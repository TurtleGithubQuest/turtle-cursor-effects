import { BaseCursor } from '../BaseCursor.js';

export class Lightning extends BaseCursor {
	constructor(options = {}) {
		super(options);

		this.lightningBolts = [];
		this.color = options.color || 'rgba(255, 255, 255, 0.8)';
		this.lineWidth = options.lineWidth || 1;
		this.lifetime = options.lifetime || 0.2;
		this.maxSegments = options.maxSegments || 3;
		this.maxOffset = options.maxOffset || 75;
		this.time_dilation = options.time_dilation || 1;

		this.targetSelector = options.targetSelector || '*';
		this.targetElements = [];
		this.collectTargetElements();
	}

	// Collect elements that can be targets for lightning
	collectTargetElements() {
		// Collect elements matching the selector
		this.targetElements = Array.from(document.querySelectorAll(this.targetSelector))
			.filter(el => {
				// Exclude the canvas element itself and hidden elements
				return el !== this.canvas && el.offsetParent !== null;
			});
	}

	// Update target elements on window resize (positions may have changed)
	onWindowResize() {
		super.onWindowResize();
		// Update target elements in case their positions have changed
		this.collectTargetElements();
	}

	onMove(x, y) {
		this.addLightningBolt(x, y);
	}

	// Add a new lightning bolt to the array
	addLightningBolt(x, y) {
		const targetElement = this.findNearestElement(x, y, 100); // e.g., within 100 pixels
		if (targetElement) {
			const rect = targetElement.getBoundingClientRect();
			// Calculate the center of the target element relative to the canvas
			const canvasRect = this.canvas.getBoundingClientRect();
			const targetX = rect.left + rect.width / 2 - canvasRect.left;
			const targetY = rect.top + rect.height / 2 - canvasRect.top;
			const bolt = new this.LightningBolt(x, y, targetX, targetY, this);
			this.lightningBolts.push(bolt);
		} else {
			// No nearby element, default behavior (random bolt)
			const bolt = new this.LightningBolt(x, y, null, null, this);
			this.lightningBolts.push(bolt);
		}
	}

	// Find the nearest element to the cursor position within a maximum distance
	findNearestElement(x, y, maxDistance) {
		let nearestElement = null;
		let minDistanceSq = maxDistance * maxDistance;

		for (let el of this.targetElements) {
			const rect = el.getBoundingClientRect();
			// Calculate the center of the element relative to the canvas
			const canvasRect = this.canvas.getBoundingClientRect();
			const elX = rect.left + rect.width / 2 - canvasRect.left;
			const elY = rect.top + rect.height / 2 - canvasRect.top;

			const dx = elX - x;
			const dy = elY - y;
			const distanceSq = dx * dx + dy * dy;

			if (distanceSq < minDistanceSq) {
				minDistanceSq = distanceSq;
				nearestElement = el;
			}
		}

		return nearestElement;
	}

	// Update method called every animation frame
	update(deltaTime) {
		this.context.clearRect(0, 0, this.width, this.height);

		// Update and draw each lightning bolt
		for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
			const bolt = this.lightningBolts[i];
			bolt.update(deltaTime);
			bolt.draw(this.context);

			// Remove bolt if its lifespan is over
			if (bolt.lifeSpan <= 0) {
				this.lightningBolts.splice(i, 1);
			}
		}
	}

	// Inner class representing a single lightning bolt
	LightningBolt = class {
		constructor(x, y, targetX, targetY, parent) {
			this.parent = parent;
			this.startX = x;
			this.startY = y;
			this.endX = targetX;
			this.endY = targetY;
			this.points = [];
			this.lifeSpan = parent.lifetime; // Lifespan in seconds
			this.generateBolt();
		}

		// Generate a jagged path for the lightning bolt
		generateBolt() {
			const { maxSegments, maxOffset } = this.parent;
			let x = this.startX;
			let y = this.startY;

			this.points.push({ x, y });

			if (this.endX != null && this.endY != null) {
				// Generate bolt towards the target position
				const dx = this.endX - this.startX;
				const dy = this.endY - this.startY;
				const distance = Math.hypot(dx, dy);
				const stepX = dx / maxSegments;
				const stepY = dy / maxSegments;

				for (let i = 1; i <= maxSegments; i++) {
					x = this.startX + stepX * i + (Math.random() - 0.5) * maxOffset * 2;
					y = this.startY + stepY * i + (Math.random() - 0.5) * maxOffset * 2;

					this.points.push({ x, y });
				}
			} else {
				// Default behavior: generate random bolt
				for (let i = 0; i < maxSegments; i++) {
					x += (Math.random() - 0.5) * maxOffset * 2;
					y += (Math.random() * maxOffset);

					this.points.push({ x, y });
				}
			}
		}

		// Update the bolt's lifespan
		update(deltaTime) {
			this.lifeSpan -= deltaTime;
		}

		// Draw the bolt on the canvas
		draw(context) {
			context.save();

			// Calculate alpha based on remaining lifespan
			const alpha = Math.max(this.lifeSpan / this.parent.lifetime, 0);
			context.globalAlpha = alpha;
			context.lineWidth = this.parent.lineWidth;
			context.strokeStyle = this.parent.color;

			context.beginPath();
			context.moveTo(this.points[0].x, this.points[0].y);

			for (let i = 1; i < this.points.length; i++) {
				context.lineTo(this.points[i].x, this.points[i].y);
			}

			context.stroke();
			context.restore();
		}
	};
}