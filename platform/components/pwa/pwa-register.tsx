"use client";

import { SerwistProvider } from "@serwist/turbopack/react";
import { useEffect, type ReactNode } from "react";

type PwaRegisterProps = {
  enabled: boolean;
  children: ReactNode;
};

async function unregisterServiceWorkers() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
}

export function PwaRegister({ enabled, children }: PwaRegisterProps) {
  useEffect(() => {
    if (!enabled) {
      void unregisterServiceWorkers();
    }
  }, [enabled]);

  if (!enabled) {
    return children;
  }

  return <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>;
}
