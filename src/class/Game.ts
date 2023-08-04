import { game, github, hiscoreKey, road } from "config";
import { Codes } from "lib/Codes";
import { Sound } from "lib/Sounds";
import { bind, state } from "lib/Utils";
import { proxy, subscribe } from "valtio";
import { Display } from "view/Display";

import { Back } from "./Back";
import { Bird } from "./Bird";
import { Debug } from "./Debug";
import { Pipe } from "./Pipe";
import { Road } from "./Road";
import { Score } from "./Score";
import { Start } from "./Start";

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
  scale = 1;

  width = game.width;
  height = game.height;
  heightFiel = this.height - road.height;

  display = new Display(this);

  constructor() {
    subscribe(this.state, () => {
      this.change();
    });

    this.update();

    Codes.add('qwerty', () => {
      const v = this.bird.auto = !this.bird.auto;
      console.log('Автопилот ' + (v ? 'включен' : 'выключен'));
    });
  }

  time = performance.now();
  start = Start.init(this);
  back = Back.init(this);
  road = Road.init(this);
  bird = Bird.init(this);
  debug = Debug.init(this);
  score = Score.init(this);

  objects: Pipe[] = [];

  work = true;

  @bind()
  setScale(num = 1) {
    this.scale = num;
  }

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
    this.start.reset();
    this.score.reset();
    Sound.swooshing.play();
  }

  @bind()
  github() {
    window.open(github);
  }

  @bind()
  destroy() {
    this.work = false;
    Codes.del('qwerty');
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
    const delta = time - this.time;
    this.time = time;

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
    // this.bird.circle.update(delta, time);
    this.debug.update(delta, time);
    this.start.update(delta, time);
    this.score.update(delta, time);

    if (delta > 100 && this.work)
      return requestAnimationFrame(this.update);

    this.render();
  }

  @bind()
  render() {
    const { display, objects, scale } = this;
    const { length } = objects;
    const { can, ctx } = display;

    if (ctx?.imageSmoothingEnabled)
      ctx.imageSmoothingEnabled = false;

    ctx?.setTransform(scale, 0, 0, scale, 0, 0);
    this.back.render(display);
    this.road.render(display);

    for (let i = 0; i < length; i++) {
      const obj = objects[i];
      obj?.render(display);
    }

    this.bird.render(display);
    // this.bird.circle.render(display);
    this.debug.render(display);
    this.start.render(display);
    this.score.render(display);

    if (this.work)
      return requestAnimationFrame(this.update);
  }
}
