"use client";

import * as React from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

type AccountSettings = {
  emailOrderUpdates: boolean;
  emailPromotions: boolean;
  emailRewards: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  marketingConsent: boolean;
  theme: "light" | "dark" | "system";
};

type SettingsFormProps = {
  initialSettings: AccountSettings;
};

type SettingRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
};

function SettingRow({ title, description, checked, onCheckedChange, ariaLabel }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="font-medium text-[var(--color-foreground)]">{title}</p>
        <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={ariaLabel} />
    </div>
  );
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [isSaving, setIsSaving] = React.useState(false);

  const updateSetting = <K extends keyof AccountSettings>(field: K, value: AccountSettings[K]) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => window.setTimeout(resolve, 500));

    toast.success("Settings saved");
    setIsSaving(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Email notifications</CardTitle>
          <CardDescription>Choose which account updates should arrive in your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow
            title="Order updates"
            description="Shipment milestones, delivery alerts, and invoice availability."
            checked={settings.emailOrderUpdates}
            onCheckedChange={(checked) => updateSetting("emailOrderUpdates", checked)}
            ariaLabel="Toggle email order updates"
          />
          <SettingRow
            title="Promotions"
            description="New launches, private offers, and editorial campaign highlights."
            checked={settings.emailPromotions}
            onCheckedChange={(checked) => updateSetting("emailPromotions", checked)}
            ariaLabel="Toggle promotional emails"
          />
          <SettingRow
            title="Rewards"
            description="Points activity, tier progress, and benefit reminders."
            checked={settings.emailRewards}
            onCheckedChange={(checked) => updateSetting("emailRewards", checked)}
            ariaLabel="Toggle reward emails"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device and consent settings</CardTitle>
          <CardDescription>Control how VERONICA MARK reaches you beyond email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow
            title="Push notifications"
            description="Receive time-sensitive updates on supported devices and browsers."
            checked={settings.pushEnabled}
            onCheckedChange={(checked) => updateSetting("pushEnabled", checked)}
            ariaLabel="Toggle push notifications"
          />
          <SettingRow
            title="SMS updates"
            description="Get concise text updates for deliveries and special account moments."
            checked={settings.smsEnabled}
            onCheckedChange={(checked) => updateSetting("smsEnabled", checked)}
            ariaLabel="Toggle SMS updates"
          />
          <SettingRow
            title="Marketing consent"
            description="Allow tailored campaigns and curated recommendations based on your activity."
            checked={settings.marketingConsent}
            onCheckedChange={(checked) => updateSetting("marketingConsent", checked)}
            ariaLabel="Toggle marketing consent"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Switch between light, dark, and system theme modes. Each tap cycles to the next preference.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-[var(--color-foreground)]">Theme preference</p>
              <Badge variant="outline">Saved default: {settings.theme}</Badge>
            </div>
            <p className="max-w-2xl text-sm text-[var(--color-muted-foreground)]">
              `Light` keeps the storefront bright, `Dark` reduces glare for evening browsing, and `System` follows
              your device setting automatically.
            </p>
          </div>
          <ThemeToggle compact={false} />
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
