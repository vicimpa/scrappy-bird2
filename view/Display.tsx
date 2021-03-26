import React, { Component, createRef } from "preact/compat";
import { zoom } from "~/config"
import { Entity } from "~/class/Entity"
import { Game } from "../class/Game";

export class Display extends Component{
  #can = createRef<HTMLCanvasElement>()

  get can() { return this.#can.current }
  get ctx() { return this.can?.getContext('2d') }

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