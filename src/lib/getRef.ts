import { Ref } from "react";

export const getRef = <T>(ref: Ref<T>) => {
  return ref instanceof Function ? null : ref?.current ?? null;
};