import { afterEach, describe, expect, it, vi } from "vitest";

import { captureClientException } from "@/lib/observability/client";

describe("client observability", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs client exceptions with context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    captureClientException(new Error("boom"), { boundary: "test" });
    expect(spy).toHaveBeenCalled();
    const payload = spy.mock.calls[0]?.[1] as { message?: string; boundary?: string };
    expect(payload?.message).toBe("boom");
    expect(payload?.boundary).toBe("test");
  });
});
