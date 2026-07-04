"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns true only after the component has mounted (hydrated) on the client.
 * Uses useSyncExternalStore so the server render (false) and the initial client
 * hydration match, then flips to true — without a setState-in-effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
