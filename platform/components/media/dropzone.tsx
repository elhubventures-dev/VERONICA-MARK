/**
 * @file Dropzone — drag-and-drop upload area for brand media assets.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import * as React from "react";

import { focusRingClass, motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface DropzoneProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

export function Dropzone({
  onFiles,
  accept,
  multiple = true,
  label = "Drop files here",
  hint = "PNG, JPG up to 10 MB",
  className,
}: DropzoneProps) {
  const reduceMotion = useReducedMotion();
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    onFiles?.(Array.from(list));
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motionTransition(reduceMotion)}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
        dragging ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface))]" : "border-[var(--color-border)] bg-[var(--color-surface)]",
        className,
      )}
    >
      <UploadCloud className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
      <p className="mt-4 font-medium text-[var(--color-foreground)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{hint}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn("mt-4 text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline", focusRingClass)}
      >
        Browse files
      </button>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
    </motion.div>
  );
}
