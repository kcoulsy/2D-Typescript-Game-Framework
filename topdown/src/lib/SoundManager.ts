export class SoundManager {
  sounds: { [key: string]: HTMLAudioElement } = {};

  loadSound = (name: string, url: string, force = false) => {
    const sound = new Audio(url);
    console.log("Sound loaded: " + name);
    if (!force && this.sounds[name]) {
      console.warn("Sound already loaded: " + name);
      return;
    }

    this.sounds[name] = sound;

    return sound;
  };

  playSound = (name: string) => {
    const sound = this.sounds[name];
    if (sound) {
      sound.play();
    }
  };
}
