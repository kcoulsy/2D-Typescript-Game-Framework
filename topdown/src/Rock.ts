import { Entity } from "./lib/Entity";
import { Vector2 } from "./lib/Vector2";

type RockInitArgs = [number, number];

export class Rock extends Entity<RockInitArgs> {
  private size = 50;
  private nextSize = 50;
  private velocity = new Vector2(0, 0);
  private nextUpdate = 0;
  private color = { r: 0, g: 0, b: 0 };

  init = (x?: number, y?: number) => {
    this.size = Math.random() * 100;
    this.position.X = x || Math.random() * this.game.dimensions.width;
    this.position.Y = y || Math.random() * this.game.dimensions.height;
    this.color.r = Math.random() * 255;
    this.color.g = Math.random() * 255;
    this.color.b = Math.random() * 255;
  };

  update = () => {
    const { deltaTime } = this.game;
    this.renderSquare();

    this.position.add(
      new Vector2(this.velocity.X * deltaTime, this.velocity.Y * deltaTime)
    );

    if (this.size !== this.nextSize) {
      this.size += Math.sign(this.nextSize - this.size) * deltaTime * 100;
    }

    this.color.r += Math.random() * 10 - 5;
    this.color.g += Math.random() * 10 - 5;
    this.color.b += Math.random() * 10 - 5;

    if (this.nextUpdate <= 0) {
      this.nextUpdate = Math.random() * 2000;
      const nextPoint = this.getNextRandomPoint();
      // console.log(nextPoint);
      this.moveToPoint(nextPoint);
    }

    this.nextUpdate -= Math.abs(deltaTime * 1000);
  };

  moveToPoint(point: { x: number; y: number }) {
    this.velocity.X = point.x - this.position.X;
    this.velocity.Y = point.y - this.position.Y;
  }

  getNextRandomPoint() {
    this.nextSize = Math.random() * 300;
    this.velocity.X = 0;
    this.velocity.Y = 0;
    return {
      x: Math.random() * this.game.canvas.width,
      y: Math.random() * this.game.canvas.height,
    };
  }

  renderSquare = () => {
    const { context } = this.game;
    context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    context.fillRect(this.position.X, this.position.Y, this.size, this.size);
  };
}
