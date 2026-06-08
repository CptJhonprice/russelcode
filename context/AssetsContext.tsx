"use client";

import { createContext, useContext } from "react";

interface AssetsContextValue {
  /** Called by the hero 3D scene once it has finished loading. */
  notifySceneLoaded: () => void;
}

export const AssetsContext = createContext<AssetsContextValue>({
  notifySceneLoaded: () => {},
});

export const useAssets = () => useContext(AssetsContext);
