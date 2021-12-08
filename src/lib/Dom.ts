import { toObject } from "lib/Utils";

interface AddedOptions<T extends keyof HTMLElementTagNameMap> {
  onCreate(el: HTMLElementTagNameMap[T]): void;
}

export function create<T extends keyof HTMLElementTagNameMap>(
  elem: T,
  options?: Partial<HTMLElementTagNameMap[T] & AddedOptions<T>>,
  ...childs: HTMLElement[]
) {
  const e = document.createElement(elem);
  const { onCreate, ...opt } = options || {};

  toObject(options!, e);

  for (let child of childs)
    e.appendChild(child);

  onCreate && onCreate(e);

  return e;
}