import { useEffect } from "react";

function listen<K extends keyof WindowEventMap>(t: Window, e: K, l: (e: WindowEventMap[K]) => void): void;
function listen<K extends keyof DocumentEventMap>(t: Document, e: K, l: (e: DocumentEventMap[K]) => void): void;
function listen<K extends keyof HTMLElementEventMap>(t: HTMLElement, e: K, l: (e: HTMLElementEventMap[K]) => void): void;
function listen<T extends (Window | Document | HTMLElement)>(t: T, ...a: Parameters<T['addEventListener']>) {
  useEffect(() => {
    t.addEventListener.call(t, ...a);
    return () => t.removeEventListener.call(t, ...a);
  });
}

export { listen };