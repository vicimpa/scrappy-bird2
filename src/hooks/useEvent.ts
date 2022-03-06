import { getRef } from "lib/getRef";
import { Ref, useCallback, useEffect } from "react";

type WEM = WindowEventMap;
type DEM = DocumentEventMap;
type HEM = HTMLElementEventMap;

function useEvent<
  E extends typeof window,
  K extends keyof WEM
>(
  target: E,
  event: K,
  handler: (e: WEM[K]) => any,
  deps?: any[]
): void;

function useEvent<
  E extends typeof document,
  K extends keyof DEM
>(
  target: E,
  event: K,
  handler: (e: DEM[K]) => any,
  deps?: any[]
): void;

function useEvent<
  E extends HTMLElement,
  K extends keyof HEM
>(
  target: E,
  event: K,
  handler: (e: HEM[K]) => any,
  deps?: any[]
): void;

function useEvent<
  E extends HTMLElement,
  K extends keyof HEM
>(
  target: Ref<E>,
  event: K,
  handler: (e: HEM[K]) => any,
  deps?: any[]
): void;

function useEvent(
  target: EventTarget | Ref<EventTarget> | null,
  event: string,
  handler: (e: Event) => any = () => { },
  deps?: any[]
): void {
  if (!(target instanceof EventTarget))
    target = getRef(target);

  const memoCallback = useCallback(handler, deps ?? []);
  const callback = deps ? memoCallback : handler;

  useEffect(() => {
    if (!(target instanceof EventTarget)) return;

    target.addEventListener(event, callback);

    return () => {
      if (!(target instanceof EventTarget)) return;

      target.removeEventListener(event, callback);
    };
  }, [event, callback]);
}

export const useWindowEvent = <K extends keyof WEM>(
  event: K,
  handler: (e: WEM[K]) => any,
  deps?: any[]
) => useEvent(window, event, handler, deps);

export const useDocumentEvent = <K extends keyof DEM>(
  event: K,
  handler: (e: DEM[K]) => any,
  deps?: any[]
) => useEvent(document, event, handler, deps);

export { useEvent };