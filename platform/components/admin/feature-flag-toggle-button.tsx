"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setFeatureFlagEnabledAction } from "@/lib/admin/actions/feature-flags";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

type FeatureFlagToggleButtonProps = {
  flagKey: string;
  enabled: boolean;
};

export function FeatureFlagToggleButton({ flagKey, enabled }: FeatureFlagToggleButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={enabled ? "destructive" : "default"}
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await setFeatureFlagEnabledAction({
            key: flagKey,
            enabled: !enabled,
          });

          if (!result.success) {
            toast.error(result.error.message);
            return;
          }

          toast.success(
            `${flagKey} ${result.data.enabled ? "enabled" : "disabled"} for ${result.data.environment}.`,
          );
          router.refresh();
        });
      }}
    >
      {pending ? "Saving…" : enabled ? "Disable" : "Enable"}
    </Button>
  );
}
