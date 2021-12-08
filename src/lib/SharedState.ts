import { useEffect, useState } from "react";

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

export class SharedState<T = any> {
  private _symbol = Symbol('listener');
  private _state!: T;
  private _dispatchList: Dispatch<T>[] = [];
  private _setState = (state: T) => { this.setState(state); };

  get state() { return this._state; }

  constructor(initialState: T | (() => T)) {
    this._state = initialState instanceof Function ? initialState() : initialState;

  }

  setState(newState: SetStateAction<T>): SharedState<T> {
    this._state = newState instanceof Function ?
      newState(this._state) : newState;

    this._dispatchList.forEach(e => {
      if ((e as any)[this._symbol])
        e.call(this, this._state);
      else
        e(this._state);
    });
    return this;
  }

  useState(): [T, Dispatch<T>] {
    const [nowState, dispatcher] = useState(this._state);

    useEffect(() => {
      this._dispatchList.push(dispatcher);

      return () => {
        const index = this._dispatchList.indexOf(dispatcher);

        if (index !== -1)
          this._dispatchList.splice(index, 1);
      };
    }, []);

    return [nowState, this._setState];
  }

  onChange(callback: Dispatch<T>): SharedState<T> {
    (callback as any)[this._symbol] = true;
    this._dispatchList.push(callback);
    return this;
  }

  offChange(callback?: Dispatch<T>): SharedState<T> {
    if (!callback)
      while (callback = this._dispatchList.find(e => (e as any)[this._symbol]))
        this.offChange(callback);

    let index = -1;

    while ((index = this._dispatchList.indexOf(callback!)) !== -1)
      this._dispatchList.splice(index, 1);

    return this;
  }
}
