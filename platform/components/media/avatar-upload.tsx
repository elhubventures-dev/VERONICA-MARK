/**
 * @file AvatarUpload — profile avatar with upload and remove actions.
 */

"use client";

import { Camera, Trash2 } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AvatarUploadProps {
  src?: string;
  alt: string;
  initials: string;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export function AvatarUpload({ src, alt, initials, onUpload, onRemove, className }: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Avatar className="size-20 rounded-xl">
        {src ? <AvatarImage src={src} alt={alt} /> : null}
        <AvatarFallback className="rounded-xl text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className={focusRingClass} onClick={() => inputRef.current?.click()}>
          <Camera className="size-4" aria-hidden />
          Upload
        </Button>
        {src && onRemove ? (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="size-4" aria-hidden />
            Remove
          </Button>
        ) : null}
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload?.(f); }} />
      </div>
    </div>
  );
}
