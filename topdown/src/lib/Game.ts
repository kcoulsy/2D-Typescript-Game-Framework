import { Entity } from "./Entity";
import { InputContoller } from "./InputContoller";
import { Instantiable } from "./Instantiable";
import { SoundManager } from "./SoundManager";
import { Storage } from "./Storage";

export class Game {
  private _name = "";
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _inputController = new InputContoller();
  private _soundManager = new SoundManager();
  private entities = new Set<Entity>();
  private debugMode = false;
  private _storage = new Storage("");

  lastLoopTime = 0;
  deltaTime = 0;

  constructor(name: string) {
    this._name = name;
    this._storage = new Storage(this._name);

    const canvas = document.querySelector<HTMLCanvasElement>("#game_root");
    if (!canvas) {
      throw new Error("Could not find game root canvas");
    }
    this._canvas = canvas;

    const context = this._canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get game root context");
    }
    this._context = context;

    this._inputController.subscribeOnUp("F4", () => {
      this.debug();
    });
  }

  get name() {
    return this._name;
  }

  get storage() {
    return this._storage;
  }

  get context() {
    return this._context;
  }

  get canvas() {
    return this._canvas;
  }

  get dimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  get inputController() {
    return this._inputController;
  }

  get soundManager() {
    return this._soundManager;
  }

  start = () => {
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
    setTimeout(() => {
      this.loop(0);
    }, 0);
  };

  loop = (time: number) => {
    this.deltaTime = Math.min(1, (time - this.lastLoopTime) / 1000);
    this.lastLoopTime = time;
    this.update();
    requestAnimationFrame(this.loop);
  };

  drawBackground = () => {
    this.context.fillStyle = "#111111";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = "blue";
    this.context.lineWidth = 5;
    this.context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
  };

  update = () => {
    this.drawBackground();

    this.entities.forEach((entity) => entity.update());

    if (this.debugMode) {
      this.debugText();
    }
  };

  instantiateEntity = <T extends Entity<K>, K extends Array<unknown> = []>(
    entity: Instantiable<T>,
    ...initArgs: Parameters<T["init"]>
  ) => {
    const newEntity = new entity(this);
    newEntity.init(...initArgs);
    this.entities.add(newEntity);
    return newEntity;
  };

  // addEntity = <T extends Entity<K>, K extends Array<unknown> = []>(
  //   entity: Instantiable<T>,
  //   init = true
  // ) => {
  //   const newEntity = new entity(this);
  //   if (init) {
  //     newEntity.init();
  //   }
  //   this.entities.add(newEntity);

  //   return newEntity;
  // };

  removeEntity = (entity: Entity) => {
    this.entities.delete(entity);
  };

  resizeCanvas = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log("resize");
  };

  debug = (value?: boolean) => {
    if (value === undefined) {
      this.debugMode = !this.debugMode;
    } else {
      this.debugMode = value;
    }
  };

  debugText = () => {
    const debugText: string[] = [];

    debugText.push(`FPS: ${Math.round(1 / this.deltaTime)}`);
    debugText.push(`DT: ${this.deltaTime.toFixed(3)}`);
    debugText.push(`Entities: ${this.entities.size}`);

    const downKeys = this._inputController.getDownKeys();
    const inputKeys = downKeys.join(", ");

    if (downKeys.length) {
      debugText.push(`Input: ${inputKeys}`);
    }

    this.context.fillStyle = "red";
    this.context.font = "20px Arial";
    debugText.forEach((line, i) => {
      this.context.fillText(line, 10, 30 + 20 * i);
    });
  };
}
