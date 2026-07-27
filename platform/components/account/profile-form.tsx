"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { AccountProfile } from "@/lib/account/demo-data";

type ProfileFormProps = {
  initialProfile: AccountProfile;
};

const genderOptions = ["Prefer not to say", "Female", "Male", "Non-binary"];
const languageOptions = ["English", "French", "German", "Spanish", "Italian"];
const currencyOptions = ["EUR", "USD", "GBP", "CHF"];
const timezoneOptions = ["Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Rome", "UTC"];

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [form, setForm] = React.useState(initialProfile);
  const [isSaving, setIsSaving] = React.useState(false);

  const updateField = <K extends keyof AccountProfile>(field: K, value: AccountProfile[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => window.setTimeout(resolve, 500));

    toast.success("Profile saved");
    setIsSaving(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
          <CardDescription>
            Update the information used for orders, rewards, and regional account preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" value={form.email} readOnly aria-describedby="email-note" />
            <p id="email-note" className="text-sm text-[var(--color-muted-foreground)]">
              Your sign-in email is managed separately and cannot be edited from this page.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => updateField("dateOfBirth", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={form.gender} onValueChange={(value) => updateField("gender", value)}>
              <SelectTrigger id="gender" aria-label="Gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={form.language} onValueChange={(value) => updateField("language", value)}>
              <SelectTrigger id="language" aria-label="Language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={form.currency} onValueChange={(value) => updateField("currency", value)}>
              <SelectTrigger id="currency" aria-label="Currency">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={form.timezone} onValueChange={(value) => updateField("timezone", value)}>
              <SelectTrigger id="timezone" aria-label="Timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save profile"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
