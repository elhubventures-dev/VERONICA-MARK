/**
 * @file SecuritySettings — password and session security controls.
 */

"use client";

import { KeyRound, Shield } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/forms/password-input";
import { cn } from "@/lib/utils";

export interface SecuritySettingsProps {
  onChangePassword?: (current: string, next: string) => void | Promise<void>;
  onEnableTwoFactor?: () => void;
  twoFactorEnabled?: boolean;
  className?: string;
}

export function SecuritySettings({ onChangePassword, onEnableTwoFactor, twoFactorEnabled, className }: SecuritySettingsProps) {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");

  return (
    <section className={cn("space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6", className)}>
      <div>
        <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
          <KeyRound className="size-5 text-[var(--color-primary)]" aria-hidden />
          Password
        </h2>
        <div className="mt-4 space-y-3 max-w-md">
          <PasswordInput label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
          <PasswordInput label="New password" value={next} onChange={setNext} autoComplete="new-password" />
          <Button type="button" onClick={() => onChangePassword?.(current, next)} disabled={!current || !next}>
            Update password
          </Button>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] pt-6">
        <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
          <Shield className="size-5 text-[var(--color-info)]" aria-hidden />
          Two-factor authentication
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          {twoFactorEnabled ? "Two-factor authentication is enabled on your account." : "Add an extra layer of security to your account."}
        </p>
        {!twoFactorEnabled && onEnableTwoFactor ? (
          <Button type="button" variant="outline" className="mt-4" onClick={onEnableTwoFactor}>
            Enable two-factor
          </Button>
        ) : null}
      </div>
    </section>
  );
}
