import { Display } from "view/Display";
import { game, zoom } from "config";
import { rand } from "lib/Utils";
import { Entity } from "./Entity";
import backImg from "img/back.png";

export class Back extends Entity {
  image!: HTMLImageElement;
  ready = false;

  width = game.width;
  height = game.height;
  speed = game.width / game.speed;

  color = 0;
  position = 0;

  colors = 0;

  init() {
    this.image = new Image();
    this.image.src = backImg;
    this.image.onload = () => {
      this.ready = true;
      this.colors = this.image.height / this.height;
      this.reset();
    };
    return super.init();
  }

  reset() {
    this.color = rand(0, this.colors - 1);
  }

  update(delta: number, time: number) {
    const { width, game } = this;

    if (game.state.stage < 2)
      this.position += delta * this.speed;

    this.position %= width;
  }

  render({ ctx }: Display) {
    if (!this.ready) return;

    const { width, height } = this;
    const { color, position, image } = this;

    const xdiv1 = position;
    const xdiv2 = width - xdiv1;

    const zWidth = width * zoom;
    const zHeight = height * zoom;

    ctx?.drawImage(image,
      0, height * color, width, height,
      -xdiv1 * zoom, 0, zWidth, zHeight);

    ctx?.drawImage(image,
      0, height * color, width, height,
      xdiv2 * zoom - 1, 0, zWidth, zHeight);
  }
}