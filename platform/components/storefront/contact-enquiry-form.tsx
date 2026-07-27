"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TOPICS = [
  { value: "general", label: "General enquiry" },
  { value: "product", label: "Product advice" },
  { value: "partnership", label: "Brand partnership" },
  { value: "other", label: "Something else" },
] as const;

type Status = "idle" | "error" | "success";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactEnquiryForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !topic || !message) {
      setStatus("error");
      setError("Please complete all required fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }
    if (message.length < 12) {
      setStatus("error");
      setError("Please share a little more detail so we can assist properly.");
      return;
    }

    setStatus("success");
    setError("");
    form.reset();
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5" aria-describedby="enquiry-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="enquiry-name">Full name</Label>
          <Input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enquiry-email">Email</Label>
          <Input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry-topic">Topic</Label>
        <select
          id="enquiry-topic"
          name="topic"
          required
          defaultValue=""
          className="flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-foreground)] shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
        >
          <option value="" disabled>
            Select a topic
          </option>
          {TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry-message">Message</Label>
        <Textarea
          id="enquiry-message"
          name="message"
          rows={5}
          placeholder="How can we help?"
          required
        />
      </div>

      <Button type="submit" className="min-w-[10rem]">
        Send message
      </Button>

      <p
        id="enquiry-status"
        aria-live="polite"
        className="min-h-6 text-sm text-[var(--color-muted-foreground)]"
      >
        {status === "error"
          ? error
          : status === "success"
            ? "Thank you — your message has been received. Our team will reply shortly."
            : "We typically respond within one business day."}
      </p>
    </form>
  );
}
