/**
 * @file AnalyticsCard — contained surface for dashboard analytics modules.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motionTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AnalyticsCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({ title, description, action, children, className }: AnalyticsCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={motionTransition(reduceMotion)}>
      <Card className={cn(className)}>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {action}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
