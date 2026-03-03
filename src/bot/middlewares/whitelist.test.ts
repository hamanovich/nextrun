import { Context, NextFunction } from "grammy";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { whitelistMiddleware } from "./whitelist";

const createCtx = (id: number, username?: string): Context =>
  ({ from: { id, username } }) as unknown as Context;

describe("whitelistMiddleware", () => {
  let ctx: Context;
  let next: NextFunction;

  beforeEach(() => {
    ctx = createCtx(123, "testuser");
    next = vi.fn() as unknown as NextFunction;
    vi.clearAllMocks();
  });

  it("should call next() if user ID is in the whitelist", async () => {
    await whitelistMiddleware(ctx, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should not call next() if user ID is not in the whitelist", async () => {
    ctx = createCtx(789);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await whitelistMiddleware(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Access denied for user: 789"),
    );
    logSpy.mockRestore();
  });

  it("should early return if ctx.from is missing", async () => {
    ctx = {} as unknown as Context;

    await whitelistMiddleware(ctx, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should log warning and deny access if whitelist is empty", async () => {
    vi.resetModules();
    vi.doMock("@/lib/env", () => ({
      env: { WHITELIST_USER_IDS: "" },
    }));
    const { whitelistMiddleware: middleware } = await import("./whitelist");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await middleware(ctx, next);

    expect(next).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Whitelist empty"),
    );
    warnSpy.mockRestore();
  });
});
