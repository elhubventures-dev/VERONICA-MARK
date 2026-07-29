"use client";

import { useRouter } from "next/navigation";

import { CHECKOUT_PATH } from "@/lib/auth/checkout-gate";
import { useSession } from "@/lib/auth/client";

export function useProceedToCheckout() {
  const router = useRouter();
  const { status } = useSession();

  const proceedToCheckout = () => {
    router.push(CHECKOUT_PATH);
  };

  return {
    proceedToCheckout,
    isAuthenticated: status === "authenticated",
    isReady: true,
    status,
  };
}
