import { Entity } from "~/class/Entity"
import { game, zoom } from "~/config"

export function toObject<T>(input: Partial<T>, output: T) {
  if (typeof input != 'object')
    return

  for (let key in input) {
    if (typeof input[key] == 'object')
      toObject(input[key], output[key])
    else
      output[key] = input[key]
  }
}

class Fake { }

export function isChild(target: EventTarget, find: HTMLElement) {
  if('base' in find)
    find = find['base']

  while(target && target instanceof HTMLElement && target.parentElement != find) {
    if(target == document.body)
      return false

    target = target.parentElement
  }

  return target instanceof HTMLElement
}

export function bind(n?: any) {
  const decor: MethodDecorator = <T extends typeof Fake>(
    target: T['prototype'],
    key: string,
    prop: PropertyDescriptor
  ) => {

    if (typeof prop.value != 'function')
      return prop

    return {
      get() {
        return this[`__${key}`] ||
          (this[`__${key}`] = prop.value.bind(n ? n : this))
      }
    }
  }
  return decor
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
    !!navigator.msMaxTouchPoints
}

export function toZoom<T extends { [key: string]: number }>(
  size: T,
  z: number = zoom
): T {
  const newSize: T = { ...size }

  for (let key in newSize)
    newSize[key] = (newSize[key] * z) as any

  return newSize
}

export function getZoom() {
  const { offsetWidth, offsetHeight } = document.body
  const { width, height } = toZoom(game)
  return Math.min(offsetWidth / width, offsetHeight / height)
}

export function state(stateKey: string) {
  const decor: PropertyDecorator = (
    target,
    key: string
  ) => {
    return {
      get() {
        const { state } = this[stateKey]
        return state[key]
      },
      set(v) {
        const { state, setState } = this[stateKey]
        if (state[key] != v)
          setState({ ...state, [key]: v })
      }
    }
  }

  return decor
}

export function init() {
  const decor: PropertyDecorator = (
    target,
    key: string
  ) => {
    return {
      get() {
        const data = this[`_${key}`]

        if(data instanceof Entity) {
          if(!data.isInit) {
            data.init()
            data.isInit = true
          }
        }

        return data
      },
      set(v) {
        this[`_${key}`] = v
      }
    }
  }

  return decor
}