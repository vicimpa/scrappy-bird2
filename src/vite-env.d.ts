/// <reference types="vite/client" />
import { RefObject } from "react";

declare module 'react' {
  export function useRef<T>(): RefObject<T>;
}