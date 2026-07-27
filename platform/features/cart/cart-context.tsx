"use client";

import { useSession } from "next-auth/react";
import * as React from "react";

import { syncCartLines } from "@/features/cart/actions";
import type { StorefrontProduct } from "@/lib/storefront/demo-catalog";

const CART_STORAGE_KEY = "vm-guest-cart";
const SERVER_SYNC_DEBOUNCE_MS = 1200;

export type CartProductSnapshot = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  variantLabel: string;
  price: number;
  /** Max units that may be purchased for this variant. */
  stock: number;
};

export type CartLine = {
  variantId: string;
  quantity: number;
  product: CartProductSnapshot;
};

export type AddItemResult = {
  quantityInCart: number;
  added: number;
  limited: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (
    variantId: string,
    quantity: number,
    product: CartProductSnapshot,
  ) => AddItemResult;
  updateQuantity: (variantId: string, quantity: number) => AddItemResult;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  getLineQuantity: (variantId: string) => number;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function normalizeLine(line: CartLine): CartLine | null {
  if (!line.variantId || !line.product) return null;
  const rawStock = line.product.stock;
  // Legacy cart lines (pre-stock field) keep current qty as a temporary cap.
  const stock =
    rawStock === undefined || rawStock === null
      ? Math.max(1, Number(line.quantity) || 1)
      : Math.max(0, Number(rawStock));
  if (stock < 1) return null;
  return {
    variantId: line.variantId,
    quantity: Math.min(Math.max(1, Number(line.quantity) || 1), stock),
    product: {
      ...line.product,
      stock,
    },
  };
}

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeLine).filter((line): line is CartLine => line !== null);
  } catch {
    return [];
  }
}

function readStoredCoupon(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${CART_STORAGE_KEY}-coupon`);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [couponCode, setCouponCodeState] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const linesRef = React.useRef<CartLine[]>([]);

  React.useEffect(() => {
    const stored = readStoredCart();
    linesRef.current = stored;
    setLines(stored);
    setCouponCodeState(readStoredCoupon());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  React.useEffect(() => {
    if (!hydrated || status !== "authenticated" || !session?.user?.id) {
      return;
    }

    const timer = window.setTimeout(() => {
      void syncCartLines(
        lines.map((line) => ({
          variantId: line.variantId,
          quantity: line.quantity,
          unitPrice: line.product.price,
        })),
      );
    }, SERVER_SYNC_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [lines, hydrated, status, session?.user?.id]);

  const setCouponCode = React.useCallback((code: string | null) => {
    setCouponCodeState(code);
    if (code) {
      localStorage.setItem(`${CART_STORAGE_KEY}-coupon`, code);
    } else {
      localStorage.removeItem(`${CART_STORAGE_KEY}-coupon`);
    }
  }, []);

  const getLineQuantity = React.useCallback(
    (variantId: string) => lines.find((line) => line.variantId === variantId)?.quantity ?? 0,
    [lines],
  );

  const addItem = React.useCallback(
    (variantId: string, quantity: number, product: CartProductSnapshot): AddItemResult => {
      const stock = Math.max(0, product.stock);
      const requested = Math.max(0, Math.floor(quantity));
      const prev = linesRef.current;
      const existing = prev.find((line) => line.variantId === variantId);
      const currentQty = existing?.quantity ?? 0;
      const nextQty = Math.min(stock, currentQty + requested);
      const added = Math.max(0, nextQty - currentQty);
      const result: AddItemResult = {
        quantityInCart: nextQty,
        added,
        limited: added < requested,
      };

      if (stock < 1 || nextQty < 1) {
        const next = prev.filter((line) => line.variantId !== variantId);
        linesRef.current = next;
        setLines(next);
        return { quantityInCart: 0, added: 0, limited: true };
      }

      const snapshot = { ...product, stock };
      const next = existing
        ? prev.map((line) =>
            line.variantId === variantId
              ? { ...line, quantity: nextQty, product: snapshot }
              : line,
          )
        : [...prev, { variantId, quantity: nextQty, product: snapshot }];

      linesRef.current = next;
      setLines(next);
      return result;
    },
    [],
  );

  const updateQuantity = React.useCallback((variantId: string, quantity: number): AddItemResult => {
    const prev = linesRef.current;
    const existing = prev.find((line) => line.variantId === variantId);
    if (!existing) {
      return { quantityInCart: 0, added: 0, limited: true };
    }

    const stock = Math.max(0, existing.product.stock);
    if (quantity < 1 || stock < 1) {
      const next = prev.filter((line) => line.variantId !== variantId);
      linesRef.current = next;
      setLines(next);
      return { quantityInCart: 0, added: 0, limited: true };
    }

    const requested = Math.floor(quantity);
    const nextQty = Math.min(stock, requested);
    const result: AddItemResult = {
      quantityInCart: nextQty,
      added: nextQty - existing.quantity,
      limited: nextQty < requested,
    };

    const next = prev.map((line) =>
      line.variantId === variantId ? { ...line, quantity: nextQty } : line,
    );
    linesRef.current = next;
    setLines(next);
    return result;
  }, []);

  const removeItem = React.useCallback((variantId: string) => {
    setLines((prev) => {
      const next = prev.filter((line) => line.variantId !== variantId);
      linesRef.current = next;
      return next;
    });
  }, []);

  const clearCart = React.useCallback(() => {
    linesRef.current = [];
    setLines([]);
    setCouponCode(null);
  }, [setCouponCode]);

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const value = React.useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getLineQuantity,
      couponCode,
      setCouponCode,
    }),
    [
      lines,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      getLineQuantity,
      couponCode,
      setCouponCode,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function productToSnapshot(
  product: StorefrontProduct,
  variantId: string,
  variantLabel: string,
  price: number,
  stock: number,
): CartProductSnapshot {
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    image: product.image,
    variantLabel,
    price,
    stock: Math.max(0, stock),
  };
}
