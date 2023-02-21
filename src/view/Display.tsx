import { Game } from "class/Game";
import { Component, createRef, useState } from "react";

interface MyCan extends HTMLCanvasElement {
  ctx?: CanvasRenderingContext2D;
}

export class Display extends Component {
  #fakeCan: MyCan = document.createElement('canvas');
  #can = createRef<MyCan>();

  get can(): MyCan {
    this.#fakeCan.width = this.game.width;
    this.#fakeCan.height = this.game.height;
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
          width={this.game.width * scale}
          height={this.game.height * scale}
          ref={this.#can} />
      </>
    );
  }
}