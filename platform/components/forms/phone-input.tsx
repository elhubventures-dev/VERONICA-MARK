/**
 * @file PhoneInput — international phone number field with country prefix.
 */

"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const prefixes = [
  { code: "+44", label: "UK (+44)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+39", label: "IT (+39)" },
];

export interface PhoneInputProps {
  label?: string;
  prefix?: string;
  onPrefixChange?: (prefix: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function PhoneInput({ label = "Phone", prefix = "+44", onPrefixChange, value, onChange, className }: PhoneInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select value={prefix} onValueChange={onPrefixChange}>
          <SelectTrigger className="w-[130px]" aria-label="Country code">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {prefixes.map((p) => (
              <SelectItem key={p.code} value={p.code}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="tel" value={value} onChange={(e) => onChange?.(e.target.value)} autoComplete="tel-national" className="flex-1" />
      </div>
    </div>
  );
}
