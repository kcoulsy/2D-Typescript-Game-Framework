export class Vector2 {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get X() {
    return this.x;
  }

  get Y() {
    return this.y;
  }

  set X(x: number) {
    this.x = x;
  }

  set Y(y: number) {
    this.y = y;
  }

  add = (vector: Vector2) => {
    this.x += vector.X;
    this.y += vector.Y;
  };

  subtract = (vector: Vector2) => {
    this.x -= vector.X;
    this.y -= vector.Y;
  };

  multiply = (vector: Vector2) => {
    this.x *= vector.X;
    this.y *= vector.Y;
  };

  divide = (vector: Vector2) => {
    this.x /= vector.X;
    this.y /= vector.Y;
  };

  normalize = () => {
    const length = this.length();
    this.x /= length;
    this.y /= length;
  };

  length = () => {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  distance = (vector: Vector2) => {
    return Math.sqrt(
      (vector.X - this.x) * (vector.X - this.x) +
        (vector.Y - this.y) * (vector.Y - this.y)
    );
  };

  static add = (vector1: Vector2, vector2: Vector2) => {
    return new Vector2(vector1.X + vector2.X, vector1.Y + vector2.Y);
  };

  static subtract = (vector1: Vector2, vector2: Vector2) => {
    return new Vector2(vector1.X - vector2.X, vector1.Y - vector2.Y);
  };

  static multiply = (vector1: Vector2, vector2: Vector2) => {
    return new Vector2(vector1.X * vector2.X, vector1.Y * vector2.Y);
  };

  static divide = (vector1: Vector2, vector2: Vector2) => {
    return new Vector2(vector1.X / vector2.X, vector1.Y / vector2.Y);
  };
}
