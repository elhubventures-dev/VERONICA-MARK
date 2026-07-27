/**
 * @file PasswordInput — password field with visibility toggle.
 */

"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface PasswordInputProps {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
  className?: string;
}

export function PasswordInput({
  id: idProp,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  className,
}: PasswordInputProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <Input id={id} type={visible ? "text" : "password"} value={value} onChange={(e) => onChange?.(e.target.value)} autoComplete={autoComplete} className="pr-11" />
        <button type="button" onClick={() => setVisible((v) => !v)} className={cn("absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 hover:bg-[var(--color-muted)]", focusRingClass)} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
