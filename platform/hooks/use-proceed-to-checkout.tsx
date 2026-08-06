"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { FulfillmentChoiceDialog } from "@/components/storefront/fulfillment-choice-dialog";
import { useSession } from "@/lib/auth/client";
import {
  checkoutPathForFulfillment,
  FULFILLMENT_STORAGE_KEY,
  type FulfillmentMode,
} from "@/lib/commerce/fulfillment";

export function useProceedToCheckout() {
  const router = useRouter();
  const { status } = useSession();
  const [choiceOpen, setChoiceOpen] = React.useState(false);

  const proceedToCheckout = React.useCallback(() => {
    setChoiceOpen(true);
  }, []);

  const selectFulfillment = React.useCallback(
    (mode: FulfillmentMode) => {
      try {
        sessionStorage.setItem(FULFILLMENT_STORAGE_KEY, mode);
      } catch {
        // Ignore private-mode / blocked storage — query param is enough.
      }
      setChoiceOpen(false);
      router.push(checkoutPathForFulfillment(mode));
    },
    [router],
  );

  const fulfillmentDialog = (
    <FulfillmentChoiceDialog
      open={choiceOpen}
      onOpenChange={setChoiceOpen}
      onSelect={selectFulfillment}
    />
  );

  return {
    proceedToCheckout,
    selectFulfillment,
    fulfillmentDialog,
    choiceOpen,
    setChoiceOpen,
    isAuthenticated: status === "authenticated",
    isReady: true,
    status,
  };
}
