/**
 * @file DateRangePicker — accessible calendar popover for dashboard date filtering.
 */

"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { focusRingClass } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type { DateRange };

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const label =
    value?.from && value.to
      ? `${fmt(value.from)} – ${fmt(value.to)}`
      : value?.from
        ? fmt(value.from)
        : placeholder;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[280px]",
            focusRingClass,
            className,
          )}
        >
          <CalendarIcon className="size-4 text-[var(--color-muted-foreground)]" aria-hidden />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          defaultMonth={value?.from}
        />
      </PopoverContent>
    </Popover>
  );
}
