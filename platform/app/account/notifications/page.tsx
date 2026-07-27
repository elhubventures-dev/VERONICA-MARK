import type { Metadata } from "next";
import Link from "next/link";
import { BellRing } from "lucide-react";

import { NotificationsFilter } from "@/components/account/notifications-filter";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountNotifications } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Review unread updates, order alerts, and promotional notices in your VERONICA MARK account.",
};

export default async function AccountNotificationsPage() {
  const notifications = await getAccountNotifications();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"} waiting for review.`}
        actions={
          <Button asChild>
            <Link href="/shop">
              <BellRing aria-hidden />
              Explore offers
            </Link>
          </Button>
        }
      />

      <NotificationsFilter items={notifications} />
    </div>
  );
}
