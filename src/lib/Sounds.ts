import { useEffect, useState } from "react";
import dieSound from "sound/die.wav?url";
import hitSound from "sound/hit.wav?url";
import hitPipeSound from "sound/hitPipe.wav?url";
import pointSound from "sound/point.wav?url";
import swooshingSound from "sound/swooshing.wav?url";
import wingSound from "sound/wing.wav?url";

const audioCtx = new (AudioContext || (window as any)['webkitAudioContext']) as AudioContext;
const gainNode = audioCtx.createGain();

export const state = {
  _v: +(localStorage.getItem('save-volume') || 5),
  _d: [] as ((v: number) => any)[],
  get volume() {
    return this._v;
  },
  set volume(v) {
    this._v = Math.min(Math.max(v, 0), 10) | 0;
    this._d.map(e => e && typeof e == 'function' && e(this._v));
    gainNode.gain.value = this._v * 0.1;
    localStorage.setItem('save-volume', `${this._v}`);
    Sound.wing.play();
  },
  use() {
    const [v, setV] = useState(this._v);

    this._d.push(setV);

    useEffect(() => {
      return () => {
        const i = this._d.indexOf(setV);
        if (i != -1) this._d.splice(i, 1);
      };
    }, []);

    return v;
  }
};

gainNode.gain.value = state.volume * 0.1;;
gainNode.connect(audioCtx.destination);

export class Sound {
  #buffer!: AudioBuffer;
  static #now = 0;

  constructor(src = '') {
    this.loadSound(src);
  }

  loadSound(src = '') {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      audioCtx.decodeAudioData(xhr.response)
        .then((buffer) => {
          this.#buffer = buffer;
        }, console.error);
    };
    xhr.send();
  }

  play() {
    const src = audioCtx.createBufferSource();
    src.buffer = this.#buffer;
    src.connect(gainNode);
    src.start(0);
    src.onended = () => {
      src.disconnect(gainNode);
      src.onended = null;
    };
  }

  static test() {
    const array = [
      this.die,
      this.hit,
      this.hitPipe,
      this.point,
      this.swooshing,
      this.wing
    ];

    if (!array[this.#now])
      this.#now = 0;

    array[this.#now++].play();
  }

  static die = new Sound(dieSound);
  static hit = new Sound(hitSound);
  static hitPipe = new Sound(hitPipeSound);
  static point = new Sound(pointSound);
  static swooshing = new Sound(swooshingSound);
  static wing = new Sound(wingSound);
}