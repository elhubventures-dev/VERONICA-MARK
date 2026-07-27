/**
 * @file ProfileForm — editable profile fields for customer accounts.
 */

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/form";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
  loading?: boolean;
}

export function ProfileForm({ defaultValues, onSubmit, loading }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit?.(v))} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: "First name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="given-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: "Last name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="family-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" autoComplete="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save profile"}</Button>
      </form>
    </Form>
  );
}
