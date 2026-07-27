/**
 * @file FileUpload — accessible file input with selected file preview.
 */

"use client";

import { FileUp, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  accept?: string;
  label?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export function FileUpload({ accept, label = "Upload file", value, onChange, className }: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="file-upload">{label}</Label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className={focusRingClass}
          onClick={() => inputRef.current?.click()}
        >
          <FileUp className="size-4" aria-hidden />
          Choose file
        </Button>
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        />
        {value ? (
          <div className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm">
            <span className="truncate">{value.name}</span>
            <button
              type="button"
              onClick={() => onChange?.(null)}
              className={cn("rounded-lg p-1 hover:bg-[var(--color-muted)]", focusRingClass)}
              aria-label="Remove file"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <span className="text-sm text-[var(--color-muted-foreground)]">No file selected</span>
        )}
      </div>
    </div>
  );
}
