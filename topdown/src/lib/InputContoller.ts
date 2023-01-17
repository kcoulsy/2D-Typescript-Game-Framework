export class InputContoller {
  private keys: { [key: string]: boolean } = {};
  private subscriptions: { [key: string]: Array<() => void> } = {};

  constructor() {
    this.bindListeners();
  }

  bindListeners = () => {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    return () => {
      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);
    };
  };

  onKeyDown = (event: KeyboardEvent) => {
    this.keys[event.key] = true;
  };

  onKeyUp = (event: KeyboardEvent) => {
    this.keys[event.key] = false;

    if (this.subscriptions[event.key]) {
      this.subscriptions[event.key].forEach((callback) => callback());
    }
  };

  isKeyDown = (key: string) => {
    return this.keys[key] || false;
  };

  getDownKeys = () => {
    return Object.entries(this.keys)
      .filter(([key, isDown]) => isDown)
      .map(([key, isDown]) => key);
  };

  subscribeOnUp = (key: string, callback: () => void) => {
    if (!this.subscriptions[key]) {
      this.subscriptions[key] = [];
    }
    this.subscriptions[key].push(callback);

    return () => {
      this.subscriptions[key] = this.subscriptions[key].filter(
        (sub) => sub !== callback
      );
    };
  };
}
