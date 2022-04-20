import { Display } from "view/Display";

import { Entity } from "./Entity";

export class Score extends Entity {
  image!: HTMLImageElement;
  ready = false;

  colors = 0;
  scale = 1;
  start = performance.now();
  score = 0;
  position = -50;
  toPosition = -50;

  init() {
    return super.init();
  }

  update(delta: number, time: number): void {
    const { score, stage } = this.game.state;
    this.score = score;
    this.toPosition = (stage == 1 || stage == 2) ? 10 : -30;
    const d = (this.position - this.toPosition);
    if (Math.abs(d) < 0.3) this.position = this.toPosition;
    else this.position -= d * .01 * delta;
  }

  render({ ctx }: Display): void {
    if (!ctx) return;
    const cx = this.game.width * .5;
    ctx.fillStyle = '#fff';
    ctx.font = '30px thintel';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`${this.score}`, cx, this.position);
  }
}