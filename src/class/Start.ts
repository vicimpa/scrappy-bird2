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

  reset() {
  }

  update(delta: number, time: number) {
  }

  render({ ctx }: Display) {
    if (!this.ready) return;

    const { width, height } = this;
    const { image } = this;

    const [cX, cY] = [
      this.game.width * .5,
      this.game.height * .5,
    ];

    ctx?.drawImage(image,
      0, 0, width, height,
      cX - width * .5, cY - height * .5, width, height);
  }
}