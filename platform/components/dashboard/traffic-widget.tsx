/**
 * @file TrafficWidget — traffic source breakdown for brand storefront analytics.
 */

"use client";

import { Globe } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TrafficSource {
  label: string;
  sessions: number;
  share: number;
}

export interface TrafficWidgetProps {
  sources: TrafficSource[];
  title?: string;
  className?: string;
}

export function TrafficWidget({ sources, title = "Traffic sources", className }: TrafficWidgetProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-muted-foreground)]">{title}</CardTitle>
        <Globe className="size-4 text-[var(--color-info)]" aria-hidden />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sources.map((source) => (
            <li key={source.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--color-foreground)]">{source.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-muted-foreground)]">{source.sessions.toLocaleString()}</span>
                <Badge variant="secondary">{source.share}%</Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
