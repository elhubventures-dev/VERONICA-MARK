import type { Metadata } from "next";

import { AddressesManager } from "@/components/account/addresses-manager";
import { PageHeader } from "@/components/layout/page-header";
import { getAccountAddresses } from "@/lib/account/queries";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Manage your VERONICA MARK shipping and billing addresses.",
};

export default async function AccountAddressesPage() {
  const addresses = await getAccountAddresses();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Addresses"
        description="Store your preferred delivery and billing destinations for a faster checkout."
      />
      <AddressesManager initialAddresses={addresses} />
    </div>
  );
}
