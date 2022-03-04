import { Game } from "class/Game";
import { zoom } from "config";
import { Component, createRef } from "react";

interface MyCan extends HTMLCanvasElement {
  ctx?: CanvasRenderingContext2D;
}

export class Display extends Component {
  #fakeCan: MyCan = document.createElement('canvas');
  #can = createRef<MyCan>();
  #top = createRef<MyCan>();
  #bottom = createRef<MyCan>();

  get can(): MyCan {
    this.#fakeCan.width = this.game.width * zoom;
    this.#fakeCan.height = this.game.height * zoom;
    return this.#can.current || this.#fakeCan;
  }

  get ctx(): MyCan['ctx'] {
    return this.can.ctx ||
      (this.can && (this.can.ctx = this.can.getContext('2d') as any));
  }

  get top(): MyCan {
    this.#fakeCan.width = this.game.width * zoom;
    this.#fakeCan.height = this.game.height * zoom;
    return this.#top.current || this.#fakeCan;
  }

  get topCtx(): MyCan['ctx'] {
    return this.top.ctx ||
      (this.top && (this.top.ctx = this.top.getContext('2d') as any));
  }

  get bottom(): MyCan {
    this.#fakeCan.width = this.game.width * zoom;
    this.#fakeCan.height = this.game.height * zoom;
    return this.#bottom.current || this.#fakeCan;
  }

  get bottomCtx(): MyCan['ctx'] {
    return this.bottom.ctx ||
      (this.bottom && (this.bottom.ctx = this.bottom.getContext('2d') as any));
  }

  constructor(public game: Game) {
    super({});
  }

  render() {
    return (
      <>
        <canvas ref={this.#top} className="top" width={this.game.width * zoom} height={200} />
        <canvas
          className="main"
          onMouseDown={this.game.click}
          width={this.game.width * zoom}
          height={this.game.height * zoom}
          ref={this.#can} />
        <canvas ref={this.#bottom} className="bottom" width={this.game.width * zoom} height={200} />
      </>
    );
  }
}