import {BaseCursor} from '../BaseCursor.js';

export class Character extends BaseCursor {
	constructor(options = {}) {
		super(options);

		this.possibleCharacters = options.characters || ["h", "e", "l", "l", "o"];
		this.colors = options.colors || [
			"#6622CC",
			"#A755C2",
			"#B07C9E",
			"#B59194",
			"#D2A1B8",
		];
		this.cursorOffset = options.cursorOffset || { x: 0, y: 0 };
		this.font = options.font || "15px serif";

		this.randomPositiveOrNegativeOne = function () {
			return Math.random() < 0.5 ? -1 : 1;
		};

		this.characterLifeSpanFunction =
          options.characterLifeSpanFunction ||
          (() => Math.floor(Math.random() * 60 + 80));

		this.initialCharacterVelocityFunction =
          options.initialCharacterVelocityFunction ||
          (() => ({
          	x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
          	y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
          }));

		this.characterVelocityChangeFunctions =
          options.characterVelocityChangeFunctions || {
          	x_func: () => (Math.random() < 0.5 ? -1 : 1) / 30,
          	y_func: () => (Math.random() < 0.5 ? -1 : 1) / 15,
          };

		this.characterScalingFunction =
          options.characterScalingFunction ||
          ((age, lifeSpan) => {
          	let lifeLeft = lifeSpan - age;
          	return Math.max((lifeLeft / lifeSpan) * 2, 0);
          });

		this.characterNewRotationDegreesFunction =
          options.characterNewRotationDegreesFunction ||
          ((age, lifeSpan) => {
          	let lifeLeft = lifeSpan - age;
          	return lifeLeft / 5;
          });

		this.canvImages = [];
		this.initCanvImages();
	}

	init() {
		super.init();

		this.context.font = this.font;
		this.context.textBaseline = "middle";
		this.context.textAlign = "center";
	}

	initCanvImages() {
		this.canvImages = [];

		this.possibleCharacters.forEach((char) => {
			const tempCanvas = document.createElement("canvas");
			const tempContext = tempCanvas.getContext("2d");
			tempContext.font = this.font;
			tempContext.textBaseline = "middle";
			tempContext.textAlign = "center";

			const measurements = tempContext.measureText(char);

			tempCanvas.width = measurements.width;
			tempCanvas.height = measurements.actualBoundingBoxAscent * 2.5;

			tempContext.font = this.font;
			tempContext.textBaseline = "middle";
			tempContext.textAlign = "center";
			tempContext.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)]; //random color from our palette

			tempContext.fillText(
				char,
				tempCanvas.width / 2,
				measurements.actualBoundingBoxAscent
			);

			this.canvImages.push(tempCanvas);
		});
	}

	onMove(x, y) {
		const idx = Math.floor(Math.random() * this.canvImages.length);
		const img = this.canvImages[idx];
		this.addParticle(x, y, img);
	}

	addParticle(x, y, img) {
		this.particles.push(new Particle(x, y, img, this));
	}

	update(deltaTime) {
		if (this.particles.length === 0) {
			return;
		}

		this.context.clearRect(0, 0, this.width, this.height);

		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].update(this.context, deltaTime);
		}

		for (let i = this.particles.length - 1; i >= 0; i--) {
			if (this.particles[i].lifeSpan < 0) {
				this.particles.splice(i, 1);
			}
		}
	}

}

class Particle {
	constructor(x, y, canvasItem, parent) {
		this.parent = parent;
		const lifeSpan = parent.characterLifeSpanFunction();
		this.rotationSign = parent.randomPositiveOrNegativeOne();
		this.age = 0;
		this.initialLifeSpan = lifeSpan;
		this.lifeSpan = lifeSpan;
		this.velocity = parent.initialCharacterVelocityFunction();
		this.position = {
			x: x + parent.cursorOffset.x,
			y: y + parent.cursorOffset.y,
		};
		this.canv = canvasItem;
	}

	update(context, deltaTime) {
		// Update the position based on velocity and deltaTime
		this.position.x += this.velocity.x * deltaTime;
		this.position.y += this.velocity.y * deltaTime;

		// Update life span and age
		this.lifeSpan -= deltaTime;
		this.age += deltaTime;

		// Update velocity
		this.velocity.x +=
      this.parent.characterVelocityChangeFunctions.x_func(this.age, this.initialLifeSpan) *
      deltaTime;
		this.velocity.y +=
      this.parent.characterVelocityChangeFunctions.y_func(this.age, this.initialLifeSpan) *
      deltaTime;

		const scale = this.parent.characterScalingFunction(
			this.age,
			this.initialLifeSpan
		);

		const degrees =
      this.rotationSign *
      this.parent.characterNewRotationDegreesFunction(
      	this.age,
      	this.initialLifeSpan
      );
		const radians = degrees * (Math.PI / 180); // Convert degrees to radians

		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(radians);

		context.drawImage(
			this.canv,
			(-this.canv.width / 2) * scale,
			-this.canv.height / 2,
			this.canv.width * scale,
			this.canv.height * scale
		);

		context.restore();
	}
}