import { game, start } from "config";
import startImg from "img/start.png";
import { Display } from "view/Display";

import { Entity } from "./Entity";

export class Start extends Entity {
  image!: HTMLImageElement;
  ready = false;

  width = start.width;
  height = start.height;
  speed = game.width / game.speed;

  colors = 0;
  scale = 1;
  start = performance.now();

  init() {
    this.image = new Image();
    this.image.src = startImg;
    this.image.onload = () => {
      this.ready = true;
      this.colors = this.image.height / this.height;
      this.reset();
    };
    return super.init();
  }

  reset(): void {
    this.start = performance.now();
  }

  update(delta: number, time: number) {
    const perf = (time - this.start) % 2000 * .003;
    const sin = 1 - Math.abs((perf < 1 ? perf : 0) - .5);
    this.game.debug.set('sin', sin);
    this.scale = sin;
  }

  render({ ctx }: Display) {
    if (!this.ready) return;

    const { width, height, scale } = this;
    const { image, game } = this;

    const [cX, cY] = [
      this.game.width * .5,
      this.game.height * .5,
    ];

    if (game.state.stage == 0) {
      ctx?.save();
      ctx?.transform(1, 0, 0, 1, 0, scale * 10);
      ctx?.drawImage(image,
        0, 0, width, height,
        cX - width * .5, cY - height * .5, width, height);
      ctx?.restore();
    }
  }
}