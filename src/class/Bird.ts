import { bird } from "config";
import birdImage from "img/bird.png";
import { Sound } from "lib/Sounds";
import { rand } from "lib/Utils";
import { Display } from "view/Display";

import { Circle } from "./Circle";
import { Entity } from "./Entity";

const { abs } = Math;
const PI5 = Math.PI / 70;
const PID = Math.PI / 2;
const F = Math.PI / 180;

export class Bird extends Entity {
  image!: HTMLImageElement;
  ready = false;

  circle = new Circle(this.game);

  sX = 20;
  sY = 100;

  auto = true;

  width = bird.width;
  height = bird.height;

  frame = 0;
  color = 0;
  death = 0;

  rotate = 0;
  speed = 0;
  maxSpeed = 30;
  maxSpeed2 = 50;
  minSpeed = -15;

  frames = 0;
  colors = 0;

  upFly = 80;
  upFlyNeed = this.upFly;
  upFlyCount = 250;
  upFlyLast = performance.now();
  free = 0;

  init() {
    this.image = new Image();
    this.image.src = birdImage;
    this.image.onload = () => {
      this.ready = true;
      this.frames = this.image.width / this.width;
      this.colors = this.image.height / this.height;
      this.reset();
    };
    return super.init();
  }

  reset() {
    this.x = 20;
    this.y = 100;
    this.rotate = 0;
    this.color = rand(0, this.colors - 1);
  }

  click() {
    if (this.game.state.stage == 1) {
      this.upFlyLast = performance.now();

      if (this.y > -this.height) {
        this.upFly = this.upFlyNeed / 4;
        this.speed = this.minSpeed;
        Sound.wing.play();
      }
    }
  }

  update(delta = 0, time = 0) {
    const { upFly, height: birdHeight, game, frames } = this;
    const { state: { stage }, heightFiel: height, objects } = game;

    const maxSpeed = stage == 1 ? this.maxSpeed : this.maxSpeed2;

    if (this.upFly != this.upFlyNeed) {
      if (time - this.upFlyLast >= this.upFlyCount)
        this.upFly = this.upFlyNeed;
    }

    this.circle.x = this.x;

    if (stage < 2)
      this.frame = (abs(time % (upFly * frames * 2) - upFly * frames) / upFly) | 0;

    if (stage == 0)
      this.y = 100 + Math.cos(PID + time * 0.005) * 10;

    if (this.auto) {
      if (stage == 0)
        this.game.click();

      if (stage == 3 && ++this.frame > 200) {
        this.free = 0;
        this.game.reset();
      }

      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];

        if (obj.x + obj.width < this.x)
          continue;


        this.circle.y = Math.min(
          obj.y + obj.door + (obj.x > this.x + this.width ? obj.x - this.x - 15 : 0),
          game.height - 60
        );

        if (
          (this.speed > this.minSpeed + 5 && this.circle.y < this.y + this.height)
        ) {
          this.click();
        }

        break;
      }
    }

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (!obj.isInit) continue;

      if (obj.x < this.x && !obj.score) {
        obj.score = true;
        game.addScore();
        Sound.point.play();
      }

      if (obj.isColize(this) && stage == 1) {
        game.state.stage = 2;

        Sound.hit.play();

        setTimeout((e: number) => {
          Sound.die.play();
        }, 300);

        if (this.x - 6 + this.width > obj.x) {
          if (this.y > obj.y)
            this.speed = this.minSpeed * 0.7;
          else
            this.speed = Math.abs(this.speed) * 0.6;
        } else {
          this.speed = 0;
        }
      }
    }

    if (stage == 1 || stage == 2) {
      this.rotate = (this.speed * 50 * PI5 - 10) * F;

      if (this.y < height - birdHeight)
        this.speed += 0.04 * delta;

      if (this.speed > maxSpeed)
        this.speed = maxSpeed;

      this.y += this.speed * delta * 0.01;

      if (this.y > height - birdHeight) {
        this.y = height - birdHeight;
        this.game.state.stage = 3;
        Sound.hit.play();
      }
    }
  }

  render({ ctx }: Display) {
    if (!this.ready) return;

    const { image, x, y, width, height } = this;
    const { color, frame, death } = this;

    const nX = x;
    const nY = y;

    const dX = width * .5;
    const dY = height * .5;

    ctx?.beginPath();

    ctx?.save();
    ctx?.translate(nX + dX, nY + dY);
    ctx?.rotate(this.rotate);

    ctx?.drawImage(image,
      width * frame + width * 3 * death,
      color * height, width, height,
      -dX, -dY, width, height);

    ctx?.rotate(-this.rotate);
    ctx?.translate(-nX - dX, -nY - dY);
    ctx?.restore();

    ctx?.closePath();
  }
}