import type { ReactNode } from "react";

import { PwaInstallPrompt } from "@/components/pwa/pwa-install-prompt";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { PwaSplashScreen } from "@/components/pwa/pwa-splash-screen";

type PwaShellProps = {
  enabled: boolean;
  children: ReactNode;
};

export function PwaShell({ enabled, children }: PwaShellProps) {
  return (
    <PwaRegister enabled={enabled}>
      {children}
      <PwaSplashScreen enabled={enabled} />
      <PwaInstallPrompt enabled={enabled} />
    </PwaRegister>
  );
}
