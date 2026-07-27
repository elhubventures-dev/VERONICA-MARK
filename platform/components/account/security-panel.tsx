"use client";

import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

type SecurityPanelProps = {
  initialSecurity: {
    lastPasswordChange: string;
    twoFactorEnabled: boolean;
    sessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  };
};

type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function formatPasswordDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SecurityPanel({ initialSecurity }: SecurityPanelProps) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errors, setErrors] = React.useState<PasswordErrors>({});
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(initialSecurity.twoFactorEnabled);
  const [sessions, setSessions] = React.useState(initialSecurity.sessions);

  const validatePasswordForm = () => {
    const nextErrors: PasswordErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword = "Enter your current password.";
    }

    if (newPassword.length < 8) {
      nextErrors.newPassword = "Use at least 8 characters for your new password.";
    }

    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsSavingPassword(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setIsSavingPassword(false);
    toast.success("Password updated");
  };

  const handleTwoFactorChange = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast.success(checked ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((current) => current.filter((session) => session.id !== sessionId));
    toast.success("Session revoked");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Last changed on {formatPasswordDate(initialSecurity.lastPasswordChange)}. Choose a strong, unique
              password for your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  aria-invalid={errors.currentPassword ? "true" : "false"}
                  aria-describedby={errors.currentPassword ? "current-password-error" : undefined}
                />
                {errors.currentPassword ? (
                  <p id="current-password-error" className="text-sm text-[var(--color-error)]">
                    {errors.currentPassword}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  aria-invalid={errors.newPassword ? "true" : "false"}
                  aria-describedby={errors.newPassword ? "new-password-error" : "new-password-help"}
                />
                <p id="new-password-help" className="text-sm text-[var(--color-muted-foreground)]">
                  Use at least 8 characters with a mix of letters, numbers, and symbols.
                </p>
                {errors.newPassword ? (
                  <p id="new-password-error" className="text-sm text-[var(--color-error)]">
                    {errors.newPassword}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                />
                {errors.confirmPassword ? (
                  <p id="confirm-password-error" className="text-sm text-[var(--color-error)]">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </div>
            </CardContent>
            <CardFooter className="justify-between gap-3">
              <Link href="/auth/forgot-password" className="text-sm text-[var(--color-primary)] hover:underline">
                Forgot your password?
              </Link>
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? "Updating..." : "Change password"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Two-factor authentication</CardTitle>
            <CardDescription>
              Add a second verification step to help keep your account secure when signing in on new devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium text-[var(--color-foreground)]">Authenticator app</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Demo control only. Turn this on to preview how a secured account setting will appear.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={twoFactorEnabled ? "success" : "outline"}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorChange}
                  aria-label="Toggle two-factor authentication"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Review where your account is signed in and revoke any device you no longer use.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{session.device}</p>
                  {session.current ? <Badge>Current</Badge> : null}
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">{session.location}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">Last active {session.lastActive}</p>
              </div>
              {session.current ? (
                <p className="text-sm text-[var(--color-muted-foreground)]">This session cannot be revoked.</p>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
