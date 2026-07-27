"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, BellRing } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AccountNotification } from "@/lib/account/demo-data";
import { cn } from "@/lib/utils";

type NotificationsFilterProps = {
  items: AccountNotification[];
};

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const filterLabels = {
  all: "All",
  unread: "Unread",
} as const;

type FilterKey = keyof typeof filterLabels;

export function NotificationsFilter({ items }: NotificationsFilterProps) {
  const [filter, setFilter] = React.useState<FilterKey>("all");

  const unreadCount = items.filter((item) => !item.read).length;
  const filteredItems = filter === "unread" ? items.filter((item) => !item.read) : items;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(filterLabels) as FilterKey[]).map((key) => {
          const isActive = filter === key;
          const count = key === "all" ? items.length : unreadCount;

          return (
            <Button
              key={key}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
            >
              {filterLabels[key]}
              <span className="text-xs opacity-80">{count}</span>
            </Button>
          );
        })}
      </div>

      {filteredItems.length ? (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const content = (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={!item.read ? "accent" : "outline"}>
                        {!item.read ? "Unread" : "Read"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <h2 className="font-display text-xl">{item.title}</h2>
                  </div>
                  <span className="text-sm text-[var(--color-muted-foreground)]">
                    {formatCreatedAt(item.createdAt)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {!item.read ? (
                    <BellRing className="mt-0.5 size-5 shrink-0 text-[var(--color-primary)]" aria-hidden />
                  ) : (
                    <Bell className="mt-0.5 size-5 shrink-0 text-[var(--color-muted-foreground)]" aria-hidden />
                  )}
                  <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{item.body}</p>
                </div>
              </>
            );

            return (
              <Card
                key={item.id}
                className={cn(
                  "transition-colors",
                  !item.read && "border-[var(--color-primary)]/35 bg-[var(--color-primary)]/5",
                )}
              >
                <CardContent className="p-0">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex h-full flex-col gap-4 rounded-xl p-5 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col gap-4 rounded-xl p-5">{content}</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Bell className="size-10 text-[var(--color-muted-foreground)]" aria-hidden />
            <div className="space-y-1">
              <h2 className="font-display text-2xl">All caught up</h2>
              <p className="max-w-md text-sm text-[var(--color-muted-foreground)]">
                There are no unread notifications right now. Check back after your next order or offer drop.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={() => setFilter("all")}>
              View all notifications
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
