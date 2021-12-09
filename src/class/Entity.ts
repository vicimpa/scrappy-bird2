import { Display } from "view/Display";

import { Game } from "./Game";

export class Entity {
  isInit = false;

  x = 0;
  y = 0;

  width = 0;
  height = 0;
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  init() { return this; }
  update(delta = 0, time = 0) { }
  render(display: Display) { }
  down({ x = 0, y = 0 }) { }
  up({ x = 0, y = 0 }) { }
  click({ x = 0, y = 0 }) { }

  static init<T extends typeof Entity>(this: T, game: Game) {
    return new this(game).init() as InstanceType<T>;
  }
}