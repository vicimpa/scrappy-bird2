import { createContext, useContext } from "react";

export const ScaleContext = createContext<number>(1);
export const ScaleProvider = ScaleContext.Provider;

export const useScale = () => useContext(ScaleContext);