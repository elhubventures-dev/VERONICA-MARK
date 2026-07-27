"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { AccountAddress } from "@/lib/account/demo-data";

type AddressesManagerProps = {
  initialAddresses: AccountAddress[];
};

type EditorMode = "create" | "edit";

const emptyAddress: AccountAddress = {
  id: "",
  label: "",
  type: "SHIPPING",
  name: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
  isDefault: false,
};

export function AddressesManager({ initialAddresses }: AddressesManagerProps) {
  const [addresses, setAddresses] = React.useState(initialAddresses);
  const [editorMode, setEditorMode] = React.useState<EditorMode>("create");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<AccountAddress>(emptyAddress);

  const isEditing = editingId !== null;

  const updateDraft = <K extends keyof AccountAddress>(field: K, value: AccountAddress[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const openCreate = (type: AccountAddress["type"] = "SHIPPING") => {
    setEditorMode("create");
    setEditingId(null);
    setDraft({ ...emptyAddress, type });
  };

  const openEdit = (address: AccountAddress) => {
    setEditorMode("edit");
    setEditingId(address.id);
    setDraft(address);
  };

  const closeEditor = () => {
    setEditorMode("create");
    setEditingId(null);
    setDraft(emptyAddress);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEditing && editingId) {
      setAddresses((current) =>
        current.map((address) => (address.id === editingId ? { ...draft, id: editingId } : address)),
      );
      toast.success("Address updated");
      closeEditor();
      return;
    }

    const sameTypeCount = addresses.filter((address) => address.type === draft.type).length;
    const nextAddress: AccountAddress = {
      ...draft,
      id: `addr-${Date.now()}`,
      isDefault: sameTypeCount === 0,
    };

    setAddresses((current) => [nextAddress, ...current]);
    toast.success("Address added");
    closeEditor();
  };

  const handleSetDefault = (id: string, type: AccountAddress["type"]) => {
    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.type === type ? address.id === id : address.isDefault,
      })),
    );
    toast.success("Default address updated");
  };

  const handleRemove = (id: string) => {
    setAddresses((current) => current.filter((address) => address.id !== id));
    if (editingId === id) {
      closeEditor();
    }
    toast.success("Address removed");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => openCreate("SHIPPING")}>
            Add shipping address
          </Button>
          <Button type="button" variant="outline" onClick={() => openCreate("BILLING")}>
            Add billing address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
            <h2 className="font-display text-2xl">No saved addresses yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-muted-foreground)]">
              Add a delivery or billing address to speed up checkout and keep your orders moving smoothly.
            </p>
            <Button type="button" className="mt-6" onClick={() => openCreate("SHIPPING")}>
              Add your first address
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg">{address.label}</CardTitle>
                      <Badge variant="outline">{address.type}</Badge>
                      {address.isDefault ? <Badge>Default</Badge> : null}
                    </div>
                    <CardDescription>{address.name}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
                  <div className="space-y-1">
                    <p className="text-[var(--color-foreground)]">{address.line1}</p>
                    {address.line2 ? <p>{address.line2}</p> : null}
                    <p>
                      {address.city}, {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  {address.phone ? <p>Phone: {address.phone}</p> : null}
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => openEdit(address)}>
                      Edit
                    </Button>
                    {!address.isDefault ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address.id, address.type)}
                      >
                        Set default
                      </Button>
                    ) : null}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemove(address.id)}>
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{editorMode === "edit" ? "Edit address" : "Add address"}</CardTitle>
          <CardDescription>
            {editorMode === "edit"
              ? "Refine delivery details or billing information for this saved address."
              : "Create a new saved address for future orders."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                name="label"
                placeholder="Home, Office, Studio"
                value={draft.label}
                onChange={(event) => updateDraft("label", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Address type</Label>
              <Select value={draft.type} onValueChange={(value: AccountAddress["type"]) => updateDraft("type", value)}>
                <SelectTrigger id="type" aria-label="Address type">
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHIPPING">Shipping</SelectItem>
                  <SelectItem value="BILLING">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="line1">Address line 1</Label>
              <Input
                id="line1"
                name="line1"
                autoComplete="address-line1"
                value={draft.line1}
                onChange={(event) => updateDraft("line1", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="line2">Address line 2</Label>
              <Input
                id="line2"
                name="line2"
                autoComplete="address-line2"
                value={draft.line2 ?? ""}
                onChange={(event) => updateDraft("line2", event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={draft.city}
                  onChange={(event) => updateDraft("city", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postal-code"
                  value={draft.postalCode}
                  onChange={(event) => updateDraft("postalCode", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                autoComplete="country-name"
                value={draft.country}
                onChange={(event) => updateDraft("country", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={draft.phone ?? ""}
                onChange={(event) => updateDraft("phone", event.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              {isEditing ? (
                <Button type="button" variant="outline" onClick={closeEditor}>
                  Cancel
                </Button>
              ) : null}
              <Button type="submit">{editorMode === "edit" ? "Save changes" : "Add address"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
