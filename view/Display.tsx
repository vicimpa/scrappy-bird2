import React, { Component, createRef } from "preact/compat";
import { zoom } from "~/config"
import { Entity } from "~/class/Entity"
import { Game } from "../class/Game";

export class Display extends Component{
  #can = createRef<HTMLCanvasElement & {ctx: CanvasRenderingContext2D}>()

  get can() { 
    return this.#can.current 
  }
  get ctx() { 
    return this?.can?.ctx || 
      (this.can && (this.can.ctx = this.can.getContext('2d'))) 
  }

  constructor(public game: Game) {
    super()
  }

  render() {
    return (
      <canvas 
        onMouseDown={this.game.click}
        width={this.game.width * zoom} 
        height={this.game.height * zoom} 
        ref={this.#can} />
    )
  }
}