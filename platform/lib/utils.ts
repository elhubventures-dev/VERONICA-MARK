import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = ""): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  if (!path) {
    return base;
  }
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
