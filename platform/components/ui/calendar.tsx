/**
 * VERONICA MARK Calendar (react-day-picker v9).
 *
 * Purpose: Date selection grid with keyboard navigation.
 * A11y: Arrow keys move focus; selected dates announced via button labels.
 * Usage: `<Calendar mode="single" selected={date} onSelect={setDate} />`.
 */
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import "react-day-picker/style.css";

export type CalendarProps = DayPickerProps;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: "rdp-root",
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        month_caption: "flex h-10 items-center justify-center",
        caption_label: "text-sm font-medium text-[var(--color-foreground)]",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-transparent p-0 opacity-70 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 bg-transparent p-0 opacity-70 hover:opacity-100",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-[0.8rem] font-normal text-[var(--color-muted-foreground)]",
        week: "mt-2 flex w-full",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100",
        ),
        selected:
          "rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] hover:text-white",
        today: "rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)]",
        outside: "text-[var(--color-muted-foreground)] opacity-50",
        disabled: "text-[var(--color-muted-foreground)] opacity-50",
        range_start: "rounded-l-xl bg-[var(--color-primary)] text-white",
        range_end: "rounded-r-xl bg-[var(--color-primary)] text-white",
        range_middle: "bg-[var(--color-muted)] text-[var(--color-foreground)]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", iconClassName)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("size-4", iconClassName)} {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
