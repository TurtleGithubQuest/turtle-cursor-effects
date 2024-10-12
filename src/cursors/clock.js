import { BaseCursor } from '../BaseCursor.js';

export class Clock extends BaseCursor {
	init() {
		super.init();
		const date = new Date();
		this.day = date.getDate();
		this.year = date.getFullYear() + 1900;
		this.theDays = this.options?.theDays || [
			"SUNDAY",
			"MONDAY",
			"TUESDAY",
			"WEDNESDAY",
			"THURSDAY",
			"FRIDAY",
			"SATURDAY",
		];
		this.theMonths = this.options?.theMonths || [
			"JANUARY",
			"FEBRUARY",
			"MARCH",
			"APRIL",
			"MAY",
			"JUNE",
			"JULY",
			"AUGUST",
			"SEPTEMBER",
			"OCTOBER",
			"NOVEMBER",
			"DECEMBER",
		];
		this.time_dilation = this.options?.time_dilation || 150;
		this.dateColor = this.options?.dateColor || "blue";
		this.faceColor = this.options?.faceColor || "black";
		this.secondsColor = this.options?.secondsColor || "red";
		this.minutesColor = this.options?.minutesColor || "black";
		this.hoursColor = this.options?.hoursColor || "black";
		this.del = 0.4;
		this.siz = 45;
		this.eqf = 360 / 12;
		this.eqd = 360 / this.dateInWords().length;
		this.han = this.siz / 6.5;
		this.ofy = 0;
		this.ofx = 0;
		this.dy = [];
		this.dx = [];
		this.zy = [];
		this.zx = [];
		this.tmps = [];
		this.tmpm = [];
		this.tmph = [];
		this.tmpf = [];
		this.tmpd = [];
		this.sum = this.dateInWords().length + 12 + 3 + 4 + 5 + 1;
		this.context.font = "10px sans-serif";
		this.context.textAlign = "center";
		this.context.textBaseline = "middle";
		for (let i = 0; i < this.sum; i++) {
			this.dy[i] = 0;
			this.dx[i] = 0;
			this.zy[i] = 0;
			this.zx[i] = 0;
		}
		this.initializeParticles();
	}

	dateInWords() {
		const date = new Date();
		return (
			" " +
      this.theDays[date.getDay()] +
      " " +
      this.day +
      " " +
      this.theMonths[date.getMonth()] +
      " " +
      this.year
		).split("");
	}

	initializeParticles() {
		const dateInWords = this.dateInWords();
		const clockNumbers = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "1", "2"];
		const hourHand = ["•", "•", "•"];
		const minuteHand = ["•", "•", "•", "•"];
		const secondHand = ["•", "•", "•", "•", "•"];
		for (let i = 0; i < dateInWords.length; i++) {
			this.tmpd[i] = { color: this.dateColor, value: dateInWords[i] };
		}
		for (let i = 0; i < clockNumbers.length; i++) {
			this.tmpf[i] = { color: this.faceColor, value: clockNumbers[i] };
		}
		for (let i = 0; i < hourHand.length; i++) {
			this.tmph[i] = { color: this.hoursColor, value: hourHand[i] };
		}
		for (let i = 0; i < minuteHand.length; i++) {
			this.tmpm[i] = { color: this.minutesColor, value: minuteHand[i] };
		}
		for (let i = 0; i < secondHand.length; i++) {
			this.tmps[i] = { color: this.secondsColor, value: secondHand[i] };
		}
	}

	update(deltaTime) {
		this.updatePositions(deltaTime);
		this.draw();
	}

	updatePositions(deltaTime) {
		let widthBuffer = 80;
		this.zy[0] = Math.round((this.dy[0] += (this.cursor.y - this.dy[0]) * this.del * deltaTime));
		this.zx[0] = Math.round((this.dx[0] += (this.cursor.x - this.dx[0]) * this.del * deltaTime));
		for (let i = 1; i < this.sum; i++) {
			this.zy[i] = Math.round((this.dy[i] += (this.zy[i - 1] - this.dy[i]) * this.del * deltaTime));
			this.zx[i] = Math.round((this.dx[i] += (this.zx[i - 1] - this.dx[i]) * this.del * deltaTime));
			if (this.dy[i - 1] >= this.height - 80) this.dy[i - 1] = this.height - 80;
			if (this.dx[i - 1] >= this.width - widthBuffer) this.dx[i - 1] = this.width - widthBuffer;
		}
	}

	draw() {
		this.context.clearRect(0, 0, this.width, this.height);
		const time = new Date();
		const secs = time.getSeconds();
		const sec = (Math.PI * (secs - 15)) / 30;
		const mins = time.getMinutes();
		const min = (Math.PI * (mins - 15)) / 30;
		const hrs = time.getHours();
		const hr = (Math.PI * (hrs - 3)) / 6 + (Math.PI * time.getMinutes()) / 360;
		this.drawDate(sec);
		this.drawFace();
		this.drawHands(hr, min, sec);
	}

	drawDate(sec) {
		for (let i = 0; i < this.tmpd.length; i++) {
			this.tmpd[i].y = this.dy[i] + this.siz * 1.5 * Math.sin(-sec + (i * this.eqd * Math.PI) / 180);
			this.tmpd[i].x = this.dx[i] + this.siz * 1.5 * Math.cos(-sec + (i * this.eqd * Math.PI) / 180);
			this.context.fillStyle = this.tmpd[i].color;
			this.context.fillText(this.tmpd[i].value, this.tmpd[i].x, this.tmpd[i].y);
		} 
	}

	drawFace() {
		for (let i = 0; i < this.tmpf.length; i++) {
			this.tmpf[i].y = this.dy[this.tmpd.length + i] + this.siz * Math.sin((i * this.eqf * Math.PI) / 180);
			this.tmpf[i].x = this.dx[this.tmpd.length + i] + this.siz * Math.cos((i * this.eqf * Math.PI) / 180);
			this.context.fillStyle = this.tmpf[i].color;
			this.context.fillText(this.tmpf[i].value, this.tmpf[i].x, this.tmpf[i].y);
		}
	}

	drawHands(hr, min, sec) {
		this.drawHand(this.tmph, hr, this.hoursColor);
		this.drawHand(this.tmpm, min, this.minutesColor);
		this.drawHand(this.tmps, sec, this.secondsColor);
	}

	drawHand(handArray, angle, color) {
		for (let i = 0; i < handArray.length; i++) {
			handArray[i].y = this.dy[this.tmpd.length + 12 + i] + this.ofy + i * this.han * Math.sin(angle);
			handArray[i].x = this.dx[this.tmpd.length + 12 + i] + this.ofx + i * this.han * Math.cos(angle);
			this.context.fillStyle = color;
			this.context.fillText(handArray[i].value, handArray[i].x, handArray[i].y);
		}
	}
}