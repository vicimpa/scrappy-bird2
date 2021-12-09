import { Game } from "class/Game";
import { zoom } from "config";
import { Component, createRef } from "react";

interface MyCan extends HTMLCanvasElement {
  ctx?: CanvasRenderingContext2D;
}

export class Display extends Component {
  #fakeCan: MyCan = document.createElement('canvas');
  #can = createRef<MyCan>();

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

  render() {
    return (
      <canvas
        onMouseDown={this.game.click}
        width={this.game.width * zoom}
        height={this.game.height * zoom}
        ref={this.#can} />
    );
  }
}