"use client";

import * as React from "react";
import { MailPlus, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

type Invitation = {
  email: string;
  status: "joined" | "pending";
  sentAt: string;
};

type ReferralInviteFormProps = {
  initialInvitations: Invitation[];
};

function formatSentAt(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReferralInviteForm({ initialInvitations }: ReferralInviteFormProps) {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [invitations, setInvitations] = React.useState(initialInvitations);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Enter an email address to send an invite.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmed)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (invitations.some((invitation) => invitation.email.toLowerCase() === trimmed)) {
      toast.message("This email has already been invited.");
      return;
    }

    setIsSubmitting(true);

    const optimisticInvitation: Invitation = {
      email: trimmed,
      status: "pending",
      sentAt: new Date().toISOString(),
    };

    setInvitations((current) => [optimisticInvitation, ...current]);
    setEmail("");

    await new Promise((resolve) => window.setTimeout(resolve, 250));

    toast.success(`Invitation queued for ${trimmed}`);
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MailPlus className="size-5 text-[var(--color-primary)]" aria-hidden />
          Invite by email
        </CardTitle>
        <CardDescription>
          Send a private invite link to friends who would love the VERONICA MARK edit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              <Send aria-hidden />
              {isSubmitting ? "Sending..." : "Send invite"}
            </Button>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              The invite will appear as pending until it is accepted.
            </p>
          </div>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg">Recent invitations</h3>
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {invitations.length} total
            </span>
          </div>
          <ul className="space-y-3">
            {invitations.map((invitation) => (
              <li
                key={`${invitation.email}-${invitation.sentAt}`}
                className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{invitation.email}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Sent {formatSentAt(invitation.sentAt)}
                  </p>
                </div>
                <Badge variant={invitation.status === "joined" ? "success" : "outline"}>
                  {invitation.status === "joined" ? "Joined" : "Pending"}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
