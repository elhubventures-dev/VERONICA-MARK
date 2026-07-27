"use client";

import { useRouter } from "next/navigation";

import { CHECKOUT_PATH, checkoutSignUpUrl } from "@/lib/auth/checkout-gate";
import { useSession } from "@/lib/auth/client";

export function useProceedToCheckout() {
  const router = useRouter();
  const { status } = useSession();

  const proceedToCheckout = () => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated") {
      router.push(CHECKOUT_PATH);
      return;
    }

    router.push(checkoutSignUpUrl());
  };

  return {
    proceedToCheckout,
    isAuthenticated: status === "authenticated",
    isReady: status !== "loading",
    status,
  };
}
