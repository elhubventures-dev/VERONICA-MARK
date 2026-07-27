import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type AuthAlertProps = {
  variant: "error" | "success";
  title?: string;
  message: string;
  className?: string;
};

export function AuthAlert({ variant, title, message, className }: AuthAlertProps) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;

  return (
    <Alert
      variant={variant === "success" ? "success" : "error"}
      className={cn("rounded-xl", className)}
    >
      <Icon className="size-4" aria-hidden />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
