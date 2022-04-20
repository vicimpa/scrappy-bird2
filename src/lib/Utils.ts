import { Entity } from "class/Entity";
import { game } from "config";

export function toObject<T>(input: Partial<T>, output: T) {
  if (typeof input != 'object')
    return;

  for (let key in input) {
    if (typeof input[key] == 'object')
      toObject((input as any)[key], output[key]);
    else
      (output as any)[key] = input[key];
  }
}

class Fake { }

export function isChild(target: EventTarget, find: HTMLElement) {
  if ('base' in find)
    find = (find as any)['base'];

  while (target && target instanceof HTMLElement && target.parentElement != find) {
    if (target == document.body)
      return false;

    target = target.parentElement as any;
  }

  return target instanceof HTMLElement;
}

export function bind(n?: any) {
  const decor = <T extends typeof Fake>(
    target: T['prototype'],
    key: string,
    prop: PropertyDescriptor
  ) => {

    if (typeof prop.value != 'function')
      return prop;

    return {
      get() {
        return (this as any)[`__${key}`] ||
          ((this as any)[`__${key}`] = prop.value.bind(n ? n : this));
      }
    };
  };
  return decor;
}

export function rand(min: number, max = 0) {
  if (max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    return Math.floor(Math.random() * (min + 1));
  }
}

export function isTouchDevice() {
  return ('ontouchstart' in window) ||
    !!navigator.maxTouchPoints ||
    !!(navigator as any).msMaxTouchPoints;
}

export function toZoom<T extends { [key: string]: number; }>(
  size: T,
  z: number = 1
): T {
  const newSize: T = { ...size };

  for (let key in newSize)
    newSize[key] = (newSize[key] * z) as any;

  return newSize;
}

export function getZoom() {
  const { offsetWidth, offsetHeight } = document.body;
  const { width, height } = toZoom(game);
  return Math.min(offsetWidth / width, offsetHeight / height);
}

export function state(stateKey: string) {
  const decor = (
    target: any,
    key: string
  ) => {
    return {
      get(): any {
        const { state } = (this as any)[stateKey];
        return state[key];
      },
      set(v: any) {
        const { state, setState } = (this as any)[stateKey];
        if (state[key] != v)
          setState({ ...state, [key]: v });
      }
    };
  };

  return decor as any;
}

export function init() {
  const decor = (
    target: any,
    key: string
  ) => {
    return {
      get(): any {
        const data = (this as any)[`_${key}`];

        if (data instanceof Entity) {
          if (!data.isInit) {
            data.init();
            data.isInit = true;
          }
        }

        return data;
      },
      set(v: any) {
        (this as any)[`_${key}`] = v;
      }
    };
  };

  return decor as any;
}

interface CreateDOMProps {
  appendTo: HTMLElement;
}

export function createDOM<K extends keyof HTMLElementTagNameMap>(tag: K, props?: Partial<HTMLElementTagNameMap[K] & CreateDOMProps> | null, ...childs: HTMLElement[]) {
  const elem = document.createElement<K>(tag);
  const { appendTo, ...p } = props ?? {};

  toObject(p as any, elem);

  for (const child of childs)
    elem.appendChild(child);

  if (appendTo)
    appendTo.appendChild(elem);

  return elem;
}
