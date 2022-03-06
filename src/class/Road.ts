import { road } from "config";
import roadImage from "img/road.png";
import { Display } from "view/Display";

import { Entity } from "./Entity";

export class Road extends Entity {
  image!: HTMLImageElement;
  ready = false;
  color = 0;
  position = 0;

  speed = road.width / road.speed;
  width = road.width;
  height = road.height;

  init() {
    this.image = new Image();
    this.image.src = roadImage;
    this.image.onload = () => {
      this.ready = true;
    };
    return super.init();
  }

  update(delta: number, time: number) {
    const { width, game } = this;

    if (game.state.stage < 2)
      this.position += delta * this.speed;

    this.position %= width;
  }

  render({ ctx }: Display) {
    if (!this.ready) return;

    const { width, height, game } = this;
    const { color, position, image } = this;

    const xdiv1 = position;
    const xdiv2 = width - xdiv1;

    const ydiv1 = game.height - height;

    ctx?.drawImage(image,
      0, height * color, width, height,
      -xdiv1, ydiv1, width, height);

    ctx?.drawImage(image,
      0, height * color, width, height,
      xdiv2 - 1, ydiv1, width, height);
  }
}