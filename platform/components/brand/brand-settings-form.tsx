"use client";

import * as React from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

type BrandSettings = {
  notifyLowStock: boolean;
  notifyNewOrders: boolean;
  notifyFlashSale: boolean;
  autoPublishReviews: boolean;
  defaultCurrency: string;
  fulfillmentSlaHours: number;
};

type BrandSettingsFormProps = {
  initialSettings: BrandSettings;
};

type SettingRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
};

const currencyOptions = ["NGN", "USD"];

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

export function BrandSettingsForm({ initialSettings }: BrandSettingsFormProps) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [isSaving, setIsSaving] = React.useState(false);

  const updateSetting = <K extends keyof BrandSettings>(field: K, value: BrandSettings[K]) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => window.setTimeout(resolve, 500));

    toast.success("Settings saved", {
      description: "Workspace notifications and operating defaults were updated successfully.",
    });
    setIsSaving(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Operational notifications</CardTitle>
          <CardDescription>
            Choose which brand events require immediate visibility for the management team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SettingRow
            title="Low stock alerts"
            description="Notify the workspace when a variant falls below its defined reorder threshold."
            checked={settings.notifyLowStock}
            onCheckedChange={(checked) => updateSetting("notifyLowStock", checked)}
            ariaLabel="Toggle low stock alerts"
          />
          <SettingRow
            title="New order alerts"
            description="Surface new orders as soon as they enter the brand fulfillment queue."
            checked={settings.notifyNewOrders}
            onCheckedChange={(checked) => updateSetting("notifyNewOrders", checked)}
            ariaLabel="Toggle new order alerts"
          />
          <SettingRow
            title="Flash sale alerts"
            description="Receive notifications when flash sale performance changes materially during a live run."
            checked={settings.notifyFlashSale}
            onCheckedChange={(checked) => updateSetting("notifyFlashSale", checked)}
            ariaLabel="Toggle flash sale alerts"
          />
          <SettingRow
            title="Auto-publish reviews"
            description="Automatically publish eligible reviews without a manual moderation step."
            checked={settings.autoPublishReviews}
            onCheckedChange={(checked) => updateSetting("autoPublishReviews", checked)}
            ariaLabel="Toggle auto publish reviews"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operations defaults</CardTitle>
          <CardDescription>
            Set the baseline commercial and fulfillment preferences used throughout the workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fulfillmentSlaHours">Fulfillment SLA (hours)</Label>
            <Input
              id="fulfillmentSlaHours"
              name="fulfillmentSlaHours"
              type="number"
              min={1}
              step={1}
              value={settings.fulfillmentSlaHours}
              onChange={(event) => updateSetting("fulfillmentSlaHours", Number(event.target.value))}
            />
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Used as the expected processing target for new paid and confirmed orders.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCurrency">Currency</Label>
            <Select value={settings.defaultCurrency} onValueChange={(value) => updateSetting("defaultCurrency", value)}>
              <SelectTrigger id="defaultCurrency" aria-label="Default currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline">Current default: {settings.defaultCurrency}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Cycle between light, dark, and system themes for the brand workspace interface.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-[var(--color-foreground)]">Theme preference</p>
              <Badge variant="outline">Workspace appearance</Badge>
            </div>
            <p className="max-w-2xl text-sm text-[var(--color-muted-foreground)]">
              Use the shared theme control to preview the workspace in light, dark, or system mode before saving.
            </p>
          </div>
          <ThemeToggle compact={false} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
