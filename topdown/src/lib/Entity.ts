import { Game } from "./Game";
import { Vector2 } from "./Vector2";

export class Entity<InitArgs extends Array<unknown> = []> {
  protected game: Game;
  protected entityName: string;
  position = new Vector2(0, 0);

  constructor(game: Game) {
    this.game = game;
    this.entityName = this.constructor.name;
  }

  init: (...args: InitArgs) => void = () => {};

  update = () => {};
}
