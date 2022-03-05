import { Game } from "class/Game";
import { zoom } from "config";
import { Component, createRef, useState } from "react";

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

  constructor(public game: Game) {
    super({});
  }

  render(scale = 1) {
    return (
      <>
        <canvas
          className="main"
          onMouseDown={this.game.click}
          width={this.game.width * zoom * scale}
          height={this.game.height * zoom * scale}
          ref={this.#can} />
      </>
    );
  }
}