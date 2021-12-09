import { game, pipe, road, zoom } from "config";
import pipeImage from "img/pipe.png";
import { rand } from "lib/Utils";
import { Display } from "view/Display";

import { Bird } from "./Bird";
import { Entity } from "./Entity";

export class Pipe extends Entity {
  image!: HTMLImageElement;
  ready = false;

  go = false;
  score = false;

  width = pipe.width;
  height = pipe.height;

  speed = game.width / pipe.speed;
  padding = 40;
  door = 40;
  deltaPad = this.padding;
  div = 1 / pipe.speed;
  marg = 0;

  margin(v = 0) {
    this.marg = v;
    return this;
  }

  init() {
    const { padding } = this;
    const { height } = game;
    const { height: roadSize } = road;
    const { door } = this;

    this.image = new Image();
    this.image.src = pipeImage;
    this.image.onload = () => {
      this.ready = true;
    };

    this.x = game.width + 50;
    this.y = rand(padding, height - roadSize - door - padding / 2);
    return super.init();
  }

  isColize(bird: Bird) {
    if (this.x + 3 > bird.x + bird.width)
      return false;

    if (this.x + this.width - 3 < bird.x)
      return false;

    if (bird.y + 2 > this.y && bird.y + bird.height - 2 < this.y + this.door)
      return false;

    return true;
  }

  update(delta = 0, time: number) {
    const { game } = this;

    if (game.state.stage == 1)
      this.x -= delta * this.speed;

    if (this.x < -this.width)
      game.dropPipe(this);

    if (this.x < game.width * .5 && !this.go) {
      this.go = true;
      game.addPipe();
    }

  }

  render({ ctx }: Display) {
    if (!this.ready) return;

    const { image, width, height, x, y, door } = this;

    const zWidth = width * zoom;
    const zHeight = height * zoom;
    const nHeihgt = height - y + 40 - door;

    ctx?.drawImage(image,
      width * 0, height * 0, width, height,
      x * zoom, y * zoom - zHeight, zWidth, zHeight);

    ctx?.drawImage(image,
      width * 1, height * 0, width, nHeihgt,
      x * zoom, y * zoom + door * zoom, zWidth, nHeihgt * zoom);
  }
}