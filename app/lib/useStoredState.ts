"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * A string value persisted to localStorage, read via useSyncExternalStore so
 * the initial read is hydration-safe (no setState-in-effect needed) and
 * updates from other tabs/callers are picked up automatically.
 */
export function useStoredState<T extends string>(
  key: string,
  isValid: (value: string) => value is T,
  serverDefault: T,
  getClientDefault: () => T = () => serverDefault
) {
  const getSnapshot = useCallback(() => {
    const stored = window.localStorage.getItem(key);
    return stored !== null && isValid(stored) ? stored : getClientDefault();
  }, [key, isValid, getClientDefault]);

  const getServerSnapshot = useCallback(() => serverDefault, [serverDefault]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, next);
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key]
  );

  return [value, setValue] as const;
}
