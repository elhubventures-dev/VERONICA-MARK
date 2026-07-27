"use client";

import * as React from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";

type AdminSettingsFormProps = {
  initialSettings: {
    maintenanceMode: boolean;
    guestCheckout: boolean;
    defaultCurrency: string;
    defaultLocale: string;
    taxInclusiveDisplay: boolean;
    supportEmail: string;
  };
};

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [maintenanceMode, setMaintenanceMode] = React.useState(initialSettings.maintenanceMode);
  const [guestCheckout, setGuestCheckout] = React.useState(initialSettings.guestCheckout);
  const [taxInclusiveDisplay, setTaxInclusiveDisplay] = React.useState(initialSettings.taxInclusiveDisplay);
  const [defaultCurrency, setDefaultCurrency] = React.useState(initialSettings.defaultCurrency);
  const [defaultLocale, setDefaultLocale] = React.useState(initialSettings.defaultLocale);
  const [supportEmail, setSupportEmail] = React.useState(initialSettings.supportEmail);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("Platform settings saved in demo mode.", {
      description: `${defaultLocale.toUpperCase()} · ${defaultCurrency} · ${supportEmail}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
          <div className="space-y-1">
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Platform controls</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Adjust customer-facing operational defaults and commerce behavior for the live environment.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
              <div className="space-y-1">
                <Label htmlFor="maintenance-mode">Maintenance mode</Label>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Temporarily restrict storefront access during planned maintenance windows.
                </p>
              </div>
              <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
              <div className="space-y-1">
                <Label htmlFor="guest-checkout">Guest checkout</Label>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Allow first-time shoppers to convert without creating an account.
                </p>
              </div>
              <Switch id="guest-checkout" checked={guestCheckout} onCheckedChange={setGuestCheckout} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
              <div className="space-y-1">
                <Label htmlFor="tax-inclusive-display">Tax inclusive pricing</Label>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Display customer pricing with tax included wherever regional policy requires it.
                </p>
              </div>
              <Switch
                id="tax-inclusive-display"
                checked={taxInclusiveDisplay}
                onCheckedChange={setTaxInclusiveDisplay}
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
          <div className="space-y-1">
            <h2 className="font-display text-2xl text-[var(--color-foreground)]">Appearance</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Cycle between light, dark, and system themes for the super admin console.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
            <ThemeToggle compact={false} className="w-full justify-center" />
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-subtle)]">
        <div className="space-y-1">
          <h2 className="font-display text-2xl text-[var(--color-foreground)]">Regional defaults</h2>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Set the default locale, billing currency, and support escalation address for platform operations.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="default-currency">Default currency</Label>
            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <SelectTrigger id="default-currency">
                <SelectValue placeholder="Choose currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-locale">Default locale</Label>
            <Select value={defaultLocale} onValueChange={setDefaultLocale}>
              <SelectTrigger id="default-locale">
                <SelectValue placeholder="Choose locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="support-email">Support email</Label>
            <Input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
              placeholder="support@veronicamark.com"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setMaintenanceMode(initialSettings.maintenanceMode);
            setGuestCheckout(initialSettings.guestCheckout);
            setTaxInclusiveDisplay(initialSettings.taxInclusiveDisplay);
            setDefaultCurrency(initialSettings.defaultCurrency);
            setDefaultLocale(initialSettings.defaultLocale);
            setSupportEmail(initialSettings.supportEmail);
            toast.success("Settings reset to demo defaults.");
          }}
        >
          Reset
        </Button>
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
