"use client";

import { Printer } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

type PrintInvoiceButtonProps = Omit<ButtonProps, "onClick" | "type">;

export function PrintInvoiceButton({ children = "Print invoice", ...props }: PrintInvoiceButtonProps) {
  return (
    <Button type="button" onClick={() => window.print()} {...props}>
      <Printer className="size-4" aria-hidden />
      {children}
    </Button>
  );
}
