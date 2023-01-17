import { Entity } from "./lib/Entity";
import { Vector2 } from "./lib/Vector2";
import { Rock } from "./Rock";

export class Player extends Entity {
  private size = 50;
  private velocity = new Vector2(0, 0);
  private moveSpeed = 200;
  private spriteSheet = new Image();

  init = () => {
    console.log("Player created");
    this.position.X = this.game.dimensions.width / 2 - this.size / 2;
    this.position.Y = this.game.dimensions.height / 2 - this.size / 2;
    this.spriteSheet.src = "sprites.png";

    // would be good to have a keycode for space
    this.game.inputController.subscribeOnUp(" ", () => {
      this.game.instantiateEntity<Rock, [number, number]>(
        Rock,
        this.position.X,
        this.position.Y
      );
    });
    console.log(this.entityName);
  };

  update = () => {
    if (this.game.inputController.isKeyDown("ArrowUp")) {
      this.velocity.Y = -this.moveSpeed;
    } else if (this.game.inputController.isKeyDown("ArrowDown")) {
      this.velocity.Y = this.moveSpeed;
    } else {
      this.velocity.Y = 0;
    }

    if (this.game.inputController.isKeyDown("ArrowLeft")) {
      this.velocity.X = -this.moveSpeed;
    } else if (this.game.inputController.isKeyDown("ArrowRight")) {
      this.velocity.X = this.moveSpeed;
    } else {
      this.velocity.X = 0;
    }

    this.position.X += this.velocity.X * this.game.deltaTime;
    this.position.Y += this.velocity.Y * this.game.deltaTime;

    // if (this.velocity.x !== 0 || this.velocity.y !== 0) {
    //   this.animate = true;
    // } else {
    //   this.animate = false;
    // }

    // this.timeSinceLastFrame += Math.abs(this.game.deltaTime * 1000);

    // if (!this.animate) {
    //   this.currentAnimationFrame = 0;
    // } else {
    //   if (this.timeSinceLastFrame > 100) {
    //     this.timeSinceLastFrame = 0;
    //     if (
    //       this.currentAnimationFrame >=
    //       this.animations[this.currentAnimation].length - 1
    //     ) {
    //       this.currentAnimationFrame = 0;
    //     } else {
    //       this.currentAnimationFrame += 1;
    //     }
    //   }
    // }
    this.render();
  };

  animate = false;
  timeSinceLastFrame = 0;
  currentAnimation = "walk" as const;
  currentAnimationFrame = 0;
  animations = {
    walk: {
      start: 0,
      length: 12,
    },
  };

  render = () => {
    // const framesPerRow = 6;
    // const currentRow = Math.floor(this.currentAnimationFrame / framesPerRow);
    // const currentCol = this.currentAnimationFrame % framesPerRow;

    // context.drawImage(
    //   this.spriteSheet,
    //   currentCol * (this.spriteSheet.width / framesPerRow),
    //   currentRow * 300,
    //   this.spriteSheet.width / framesPerRow,
    //   300,
    //   this.position.x - 11,
    //   this.position.y - 7,
    //   360 / 3,
    //   300 / 3
    // );

    this.game.context.beginPath();
    this.game.context.arc(
      this.position.X,
      this.position.Y,
      10,
      0,
      Math.PI * 2,
      false
    );
    this.game.context.fillStyle = "red";
    this.game.context.fill();
  };
}
