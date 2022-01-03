type TListener = (this: CodeEngine, v: string) => void;

export class CodeEngine {
  private _input = '';
  private _codes = new Map<string, TListener>();

  private _onInput = (e: KeyboardEvent) => {
    e.preventDefault();

    if (e.key.length == 1)
      this._input += e.key;

    const codes = [...this._codes.keys()];

    let max = -Infinity;

    for (const code of codes)
      if (code.length > max)
        max = code.length;

    this._input = this._input.slice(-max);

    for (const code of codes) {
      if (this._input.includes(code)) {
        const func = this._codes.get(code) || (() => { });
        func.call(this, code);
      }
    }
  };

  constructor() {
    addEventListener('keydown', this._onInput);
  }

  destroy() {
    removeEventListener('keydown', this._onInput);
  }

  add(code: string, listener: TListener) {
    this._codes.set(code, listener);
  }

  del(code: string) {
    this._codes.delete(code);
  }
}

export const Codes = new CodeEngine();