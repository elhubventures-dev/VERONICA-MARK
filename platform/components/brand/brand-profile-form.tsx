"use client";

import * as React from "react";

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
import { toast } from "@/components/ui/sonner";

type BrandProfile = {
  name: string;
  email: string;
  title: string;
  phone: string;
  brandName: string;
  timezone: string;
  language: string;
};

type BrandProfileFormProps = {
  initialProfile: BrandProfile;
};

const languageOptions = ["English", "French", "German", "Spanish", "Italian"];
const timezoneOptions = ["Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Rome", "UTC"];

export function BrandProfileForm({ initialProfile }: BrandProfileFormProps) {
  const [form, setForm] = React.useState(initialProfile);
  const [isSaving, setIsSaving] = React.useState(false);

  const updateField = <K extends keyof BrandProfile>(field: K, value: BrandProfile[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => window.setTimeout(resolve, 500));

    toast.success("Profile saved", {
      description: "Brand manager details were updated successfully in this demo workspace.",
    });
    setIsSaving(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Manager details</CardTitle>
          <CardDescription>
            Keep workspace ownership, notifications, and internal contact information current.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Role title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace preferences</CardTitle>
          <CardDescription>
            Set the brand identity and regional defaults used across analytics, exports, and operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="brandName">Brand name</Label>
            <Input
              id="brandName"
              name="brandName"
              value={form.brandName}
              onChange={(event) => updateField("brandName", event.target.value)}
            />
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
