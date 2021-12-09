import { proxy } from "valtio";

import { Entity } from "./Entity";

export class Debug extends Entity {
  data = proxy({} as { [key: string]: string; });

  get(key: string) {
    return this.data[key];
  }

  set(key: string, value: any) {
    if (this.get(key) != value)
      this.data[key] = `${value}`;
  }

  del(key: string) {
    delete this.data[key];
  }
}