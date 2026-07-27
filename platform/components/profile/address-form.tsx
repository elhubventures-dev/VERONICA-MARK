/**
 * @file AddressForm — shipping and billing address entry form.
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
import { FormSection } from "@/components/forms/form-section";

export interface AddressFormValues {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit?: (values: AddressFormValues) => void | Promise<void>;
}

export function AddressForm({ defaultValues, onSubmit }: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    defaultValues: { line1: "", line2: "", city: "", postalCode: "", country: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit?.(v))} className="space-y-6">
        <FormSection title="Delivery address" description="Used for fragrance orders and brand deliveries.">
          <FormField control={form.control} name="line1" rules={{ required: "Address is required" }} render={({ field }) => (
            <FormItem><FormLabel>Address line 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="line2" render={({ field }) => (
            <FormItem><FormLabel>Address line 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="city" rules={{ required: "City is required" }} render={({ field }) => (
              <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="postalCode" rules={{ required: "Postal code is required" }} render={({ field }) => (
              <FormItem><FormLabel>Postal code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="country" rules={{ required: "Country is required" }} render={({ field }) => (
            <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </FormSection>
        <Button type="submit">Save address</Button>
      </form>
    </Form>
  );
}
