import type { ReactNode } from "react";

import { PwaInstallPrompt } from "@/components/pwa/pwa-install-prompt";
import { PwaRegister } from "@/components/pwa/pwa-register";

type PwaShellProps = {
  enabled: boolean;
  children: ReactNode;
};

export function PwaShell({ enabled, children }: PwaShellProps) {
  return (
    <PwaRegister enabled={enabled}>
      {children}
      <PwaInstallPrompt enabled={enabled} />
    </PwaRegister>
  );
}
