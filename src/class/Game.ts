import { Bird } from "./Bird";
import { Debug } from "./Debug";
import { Pipe } from "./Pipe";
import { bind, state, init } from "lib/Utils";
import { game, github, hiscoreKey, road, zoom } from "config";
import { Display } from "view/Display";
import { SharedState } from "lib/SharedState";
import { Back } from "./Back";
import { Road } from "./Road";
import { Sound } from "lib/Sounds";
import { proxy, subscribe } from "valtio";

const initialState = {
  score: 0,
  stage: 0,
  start: false,
  end: false
};

export class Game {
  state = proxy({
    ...initialState, hiscore: (() => {
      let hiscore = +localStorage.getItem(hiscoreKey)!;
      return isNaN(hiscore) ? 0 : hiscore;
    })()
  });

  width = game.width;
  height = game.height;
  heightFiel = this.height - road.height;

  display = new Display(this);

  constructor() {
    subscribe(this.state, () => {
      this.change();
    });

    this.update();
  }

  back = Back.init(this);
  road = Road.init(this);
  bird = Bird.init(this);
  debug = Debug.init(this);

  objects: Pipe[] = [];

  work = true;
  last = performance.now();

  @bind()
  click() {
    if (this.state.stage == 0) {
      this.state.stage = 1;

      if (this.objects.length == 0)
        this.addPipe();
    }

    this.bird.click();
  }

  @bind()
  change() {
    const { state } = this;
    let { score, hiscore } = state;

    if (score > hiscore) {
      hiscore = score;
      state.hiscore = hiscore;
      localStorage.setItem(hiscoreKey, `${hiscore}`);
    }
  }

  @bind()
  addScore() {
    this.state.score++;
  }

  @bind()
  reset() {
    for (const key in initialState) {
      (this.state as any)[key] = (initialState as any)[key];
    }

    this.objects.splice(0);
    this.bird.reset();
    this.back.reset();
    Sound.swooshing.play();
  }

  @bind()
  github() {
    window.open(github);
  }

  @bind()
  addPipe() {
    this.objects.push(new Pipe(this));
  }

  @bind()
  dropPipe(p?: Pipe) {
    const { objects } = this;

    if (!p) {
      const { length: l } = objects;

      for (let i = 0; i < l; i++) {
        const obj = objects[i];

        if (obj instanceof Pipe)
          this.dropPipe(obj);
      }

      return;
    }

    let index = objects.indexOf(p);

    if (index != -1)
      objects.splice(index, 1);
  }

  @bind()
  update() {
    const time = performance.now();
    const delta = time - this.last;
    this.last = time;

    const { objects } = this;
    const { length } = objects;

    this.back.update(delta, time);
    this.road.update(delta, time);

    for (let i = 0; i < length; i++) {
      const obj = objects[i];

      if (!obj) continue;

      if (!obj.isInit) {
        obj.init();
        obj.isInit = true;
      }

      obj.update(delta, time);
    }

    this.bird.update(delta, time);
    this.debug.update(delta, time);

    if (delta > 100 && this.work)
      return requestAnimationFrame(this.update);

    this.render();
  }

  @bind()
  render() {
    const { display, objects } = this;
    const { length } = objects;

    if (display.ctx?.imageSmoothingEnabled)
      display.ctx.imageSmoothingEnabled = false;

    display.ctx?.clearRect(0, 0, this.width * zoom, this.height * zoom);

    this.back.render(display);
    this.road.render(display);

    for (let i = 0; i < length; i++) {
      const obj = objects[i];
      obj?.render(display);
    }

    this.bird.render(display);
    this.debug.render(display);

    if (this.work)
      return requestAnimationFrame(this.update);
  }
}
