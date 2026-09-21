import { useEffect } from "react";

import { useAppearanceStore } from "@/store/appearance.store";

export function AppearanceSync() {
  const reduceMotion = useAppearanceStore(
    (state) => state.reduceMotion
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      reduceMotion
    );
  }, [reduceMotion]);

  return null;
}