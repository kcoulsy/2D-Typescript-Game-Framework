import { Entity } from "./lib/Entity";

export class Snake extends Entity {
  // blocks
  squareSize = 20;
  direction: "up" | "down" | "left" | "right" = "right";
  xChunks = 1;
  yChunks = 1;
  segments: [number, number][] = [];
  food: [number, number][] = [];
  popTail = true;
  highScore = 0;
  timeToNextMove = 0;

  init = () => {
    this.xChunks = Math.floor(this.game.dimensions.width / this.squareSize);
    this.yChunks = Math.floor(this.game.dimensions.height / this.squareSize);

    const blipSound = this.game.soundManager.loadSound("blip", "src/blip.wav");
    if (blipSound) {
      blipSound.volume = 0.1;
    }
    const musicSound = this.game.soundManager.loadSound(
      "music",
      "src/music.flac"
    );
    if (musicSound) {
      musicSound.volume = 0.025;
      musicSound.loop = true;
      musicSound.play();
    }

    this.game.inputController.subscribeOnUp("1", () => {
      if (musicSound?.paused) {
        musicSound.play();
      } else {
        musicSound?.pause();
      }
    });

    this.game.inputController.subscribeOnUp("2", () => {
      this.highScore = 0;
      this.game.storage.save({ highScore: 0 });
      this.start();
    });

    this.start();

    console.log("Snake created");
  };

  start = () => {
    const storage = this.game.storage.load();

    if (storage && storage.highScore) {
      try {
        this.highScore = parseInt(storage.highScore as string);
      } catch (e) {
        this.highScore = 0;
      }
    }

    this.segments = [
      [Math.floor(this.xChunks / 2), Math.floor(this.xChunks / 2)],
      [Math.floor(this.xChunks / 2) - 1, Math.floor(this.xChunks / 2)],
      [Math.floor(this.xChunks / 2) - 2, Math.floor(this.xChunks / 2)],
    ];
    this.food = [];
    this.direction = "right";
    this.spawnFood();
    this.spawnFood();
    this.spawnFood();
  };

  update = () => {
    this.segments.forEach(([x, y], index) => {
      this.renderSquare(x, y);
      if (index === this.segments.length - 1) {
        this.renderSquare(x, y, "#414141");
      }
      if (index === this.segments.length - 2) {
        this.renderSquare(x, y, "#AEAEAE");
      }
    });

    this.food.forEach(([x, y]) => {
      this.renderSquare(x, y, "red");
    });

    if (this.game.inputController.isKeyDown("ArrowRight")) {
      this.direction = "right";
    }

    if (this.game.inputController.isKeyDown("ArrowLeft")) {
      this.direction = "left";
    }

    if (this.game.inputController.isKeyDown("ArrowUp")) {
      this.direction = "up";
    }

    if (this.game.inputController.isKeyDown("ArrowDown")) {
      this.direction = "down";
    }

    const head = this.segments[0];

    // If head is on food, eat it
    if (this.food.find(([x, y]) => x === head[0] && y === head[1])) {
      this.food = this.food.filter(([x, y]) => x !== head[0] || y !== head[1]);
      this.game.soundManager.playSound("blip");
      this.spawnFood();
      this.popTail = false;
    }

    // If head is on tail, game over
    if (
      this.segments.find(([x, y], i) => i > 0 && x === head[0] && y === head[1])
    ) {
      this.start();
      return;
    }

    const score = this.getScore();

    if (score > this.highScore) {
      this.highScore = score;
      this.game.storage.save({ highScore: this.highScore });
    }

    if (this.timeToNextMove <= 0) {
      this.segments.unshift(this.getNextSegment());
      if (this.popTail) {
        this.segments.pop();
      }
      this.popTail = true;
      this.timeToNextMove = 0.05;
    }

    this.timeToNextMove -= Math.max(
      (this.game.deltaTime / 10) * this.segments.length,
      0.02
    );

    this.renderScore();
  };

  getScore = () => {
    return this.segments.length - 3;
  };

  getNextSegment = () => {
    const [x, y] = this.segments[0];

    const next: [number, number] = [
      x +
        (this.direction === "right" ? 1 : 0) +
        (this.direction === "left" ? -1 : 0),
      y +
        (this.direction === "down" ? 1 : 0) +
        (this.direction === "up" ? -1 : 0),
    ];

    if (next[0] < 0) {
      next[0] = this.xChunks - 1;
    }

    if (next[0] > this.xChunks - 1) {
      next[0] = 0;
    }

    if (next[1] < 0) {
      next[1] = this.yChunks - 1;
    }

    if (next[1] > this.yChunks - 1) {
      next[1] = 0;
    }

    return next;
  };

  spawnFood = () => {
    const x = Math.floor(Math.random() * this.xChunks);
    const y = Math.floor(Math.random() * this.yChunks);

    this.food.push([x, y]);
  };

  renderSquare = (x: number, y: number, color = "#D5D5D5") => {
    this.game.context.fillStyle = color;
    this.game.context.fillRect(
      x * this.squareSize,
      y * this.squareSize,
      this.squareSize,
      this.squareSize
    );
  };

  renderScore = () => {
    this.game.context.fillStyle = "white";
    this.game.context.font = "30px Arial";
    this.game.context.fillText(
      "Press 1 to pause music, 2 to reset highscore",
      10,
      50
    );
    this.game.context.fillText(
      "Highscore: " + this.highScore.toString(),
      10,
      100
    );
    this.game.context.fillText("Score: " + this.getScore().toString(), 10, 150);
  };
}
