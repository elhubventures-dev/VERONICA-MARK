/**
 * @file ProfileHeader — account header with avatar, name, and member details.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarSrc?: string;
  initials: string;
  memberSince?: string;
  tier?: string;
  className?: string;
}

export function ProfileHeader({ name, email, avatarSrc, initials, memberSince, tier, className }: ProfileHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduceMotion)}
      className={cn("flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:flex-row sm:items-center", className)}
    >
      <Avatar className="size-16 rounded-xl">
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
        <AvatarFallback className="rounded-xl text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-xl font-semibold">{name}</h1>
          {tier ? <Badge variant="accent">{tier}</Badge> : null}
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)]">{email}</p>
        {memberSince ? <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Member since {memberSince}</p> : null}
      </div>
    </motion.header>
  );
}
