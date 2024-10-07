/*jshint esversion: 11 */
import { BaseCursor } from '../BaseCursor.js';

export class Trailing extends BaseCursor {
  constructor(options) {
    super(options);
    this.totalParticles = options?.particles || 15;
    this.rate = options?.rate || 0.4;
    this.baseImageSrc =
      options?.baseImageSrc ||
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAYAAACk9eypAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADKADAAQAAAABAAAAEwAAAAAChpcNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmVmOlJERiB4bWxuczpSREY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmVmOkRlc2NyaXB0aW9uIHJlZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcgYpOkRlc2NyaXB0aW9uPgogICA8L3JEYjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABqElEQVQoFY3SPUvDQBgH8BREpRHExYiDgmLFl6WC+AYmWeyLg4i7buJX8DMpOujgyxGvUYeCgzhUQUSKKLUS0+ZyptXh8Z5Ti621ekPyJHl+uftfomhaf9Ei5JyxXKfynyEA6EYcLHpwyflT958GAQ7DTABNHd8EbtDbEH2BD5QEQmi2mM8P/Iq+A0SzszEg+3sPjDnDdVEtQKQbMUidHD3xVzf6A9UDEmEm+8h9KTqTVUjT+vB53aHrCbAPiceYq1dQI1Aqv4EhMll0jzv+Y0yiRgCnLRSYyDQHVoqUXe4uKL9l+L7GXC4vkMhE6eW/AOJs9k583ORDUyXMZ8F5SVHVVnllmPNKSFagAJ5DofaqGXw/gHBYg51dIldkmknY3tguv3jOtHR4+MqAzaraJXbEhqHhcQlwGSOi5pytVQHZLN5s0WNe8HPrLYlFsO20RPHkImxsbmHdLJFI76th7Z4SeuF53hTeFLvhRCJRCTKZKxgdnRDbW+iozFJbBMw14/ElwGYc0egMBMFzT21f5Rog33Z7dX02GBm7WV5ZfT5Nn5bE3zuCDe9UxdTpNvK+5AAAAABJRU5ErkJggg==";

    this.particles = [];
    this.lastTime = 0;

    this.baseImage = new Image();
    this.baseImage.src = this.baseImageSrc;
  }

  initializeCursor(e) {
    for (let i = 0; i < this.totalParticles; i++) {
      this.addParticle(this.cursor.x, this.cursor.y, this.baseImage);
    }
  }

  addParticle(x, y, image) {
    this.particles.push(new Particle(x, y, image));
  }

  update(deltaTime) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let x = this.cursor.x;
    let y = this.cursor.y;

    this.particles.forEach((particle, index, particles) => {
      let nextParticle = particles[index + 1] || particles[0];

      particle.position.x = x;
      particle.position.y = y;
      particle.move(this.context);
      x += (nextParticle.position.x - particle.position.x) * this.rate;
      y += (nextParticle.position.y - particle.position.y) * this.rate;
    });
  }
}

class Particle {
  constructor(x, y, image) {
    this.position = { x: x, y: y };
    this.image = image;
  }

  move(context) {
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}
