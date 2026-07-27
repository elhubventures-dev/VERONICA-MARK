export const CHECKOUT_PATH = "/checkout";

/** Sign-up URL that returns the shopper to checkout after registration. */
export function checkoutSignUpUrl(returnTo = CHECKOUT_PATH): string {
  const params = new URLSearchParams({ callbackUrl: returnTo });
  return `/auth/sign-up?${params.toString()}`;
}
