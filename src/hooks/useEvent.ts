import { RefObject, useEffect } from "react";

type Win = typeof window;
type Listener<T> = (event: T) => any;

function useEvent<T extends HTMLElement, K extends keyof HTMLElementEventMap>(ref: RefObject<T>, event: K, listener: Listener<HTMLElementEventMap[K]>,): void;
function useEvent<T extends HTMLElement, K extends keyof HTMLElementEventMap>(object: T, event: K, listener: Listener<HTMLElementEventMap[K]>,): void;
function useEvent<T extends Document, K extends keyof DocumentEventMap>(object: T, event: K, listener: Listener<DocumentEventMap[K]>,): void;
function useEvent<T extends Win, K extends keyof WindowEventMap>(object: T, event: K, listener: Listener<WindowEventMap[K]>,): void;
function useEvent<T extends EventTarget, K extends string>(object: T, event: K, listener: Listener<Event>,): void {
  const getTarget = (): EventTarget | undefined => (<any>object)?.current ?? object;

  useEffect(() => {
    getTarget()?.addEventListener(event, listener);

    return () => {
      getTarget()?.removeEventListener(event, listener);
    };
  }, [getTarget()]);

}

export { useEvent };