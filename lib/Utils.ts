export function toObject<T>(input: Partial<T>, output: T) {
  for (let key in input) {
    if (typeof input[key] == 'object')
      toObject(input[key], output[key])
    else
      output[key] = input[key]
  }
}

class Fake { }

export function bind(n?: any) {
  return <T extends typeof Fake>(
    target: T['prototype'],
    key: string,
    prop: PropertyDescriptor
  ) => {

    if (typeof prop.value != 'function')
      return prop

    return {
      get() {
        return prop.value.bind(n ? n : this)
      }
    }
  }
}

export function rand(min: number, max = 0) {
  if (max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    return Math.floor(Math.random() * (min + 1));
  }
}
