import { Display } from "view/Display";

import { Entity } from "./Entity";

export class Circle extends Entity {
  x = 0;
  y = 0;
  color = '#f00';

  render(display: Display): void {
    const { ctx } = display;
    const { x, y, width, height } = this;
    const { color } = this;

    const nX = x;
    const nY = y;

    const dX = width * .5;
    const dY = height * .5;

    ctx?.beginPath();

    ctx?.arc(x, y, 3, 0, Math.PI * 2);
    if (ctx)
      ctx.fillStyle = color;
    ctx?.fill();

    ctx?.closePath();
  }
}