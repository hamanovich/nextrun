import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWindowScroll } from "../use-scroll";

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

const originalWindow = global.window;

describe("useWindowScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(global, "window", {
      value: {
        scrollX: 0,
        scrollY: 0,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      },
      writable: true,
    });
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should return initial scroll state of (0, 0)", () => {
    const { result } = renderHook(() => useWindowScroll());

    expect(result.current[0]).toEqual({ x: 0, y: 0 });
  });

  it("should call addEventListener with scroll event on mount", () => {
    renderHook(() => useWindowScroll());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  it("should call removeEventListener with scroll event on unmount", () => {
    const { unmount } = renderHook(() => useWindowScroll());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  it("should update scroll state when scroll event is triggered", () => {
    const { result } = renderHook(() => useWindowScroll());

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    Object.defineProperty(global.window, "scrollX", {
      value: 100,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 200,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: 100, y: 200 });
  });

  it("should update scroll state multiple times with different values", () => {
    const { result } = renderHook(() => useWindowScroll());

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    Object.defineProperty(global.window, "scrollX", {
      value: 50,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 75,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: 50, y: 75 });

    Object.defineProperty(global.window, "scrollX", {
      value: 150,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 300,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: 150, y: 300 });
  });

  it("should handle negative scroll values", () => {
    const { result } = renderHook(() => useWindowScroll());

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    Object.defineProperty(global.window, "scrollX", {
      value: -50,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: -100,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: -50, y: -100 });
  });

  it("should handle large scroll values", () => {
    const { result } = renderHook(() => useWindowScroll());

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    Object.defineProperty(global.window, "scrollX", {
      value: 9999,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 8888,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: 9999, y: 8888 });
  });

  it("should work with multiple hook instances independently", () => {
    const { result: result1 } = renderHook(() => useWindowScroll());
    const { result: result2 } = renderHook(() => useWindowScroll());

    expect(result1.current[0]).toEqual({ x: 0, y: 0 });
    expect(result2.current[0]).toEqual({ x: 0, y: 0 });

    const scrollHandler1 = mockAddEventListener.mock.calls[0][1];
    const scrollHandler2 = mockAddEventListener.mock.calls[1][1];

    Object.defineProperty(global.window, "scrollX", {
      value: 100,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 200,
      writable: true,
    });

    act(() => {
      scrollHandler1();
    });

    expect(result1.current[0]).toEqual({ x: 100, y: 200 });
    expect(result2.current[0]).toEqual({ x: 0, y: 0 }); // Second instance unchanged

    Object.defineProperty(global.window, "scrollX", {
      value: 300,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 400,
      writable: true,
    });

    act(() => {
      scrollHandler2();
    });

    expect(result1.current[0]).toEqual({ x: 100, y: 200 }); // First instance unchanged
    expect(result2.current[0]).toEqual({ x: 300, y: 400 });
  });

  it("should call handleScroll immediately on mount", () => {
    Object.defineProperty(global.window, "scrollX", {
      value: 42,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 84,
      writable: true,
    });

    const { result } = renderHook(() => useWindowScroll());

    expect(result.current[0]).toEqual({ x: 42, y: 84 });
  });

  it("should maintain the same scroll handler reference across re-renders", () => {
    const { rerender } = renderHook(() => useWindowScroll());

    const firstHandler = mockAddEventListener.mock.calls[0][1];

    rerender();

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);

    expect(mockAddEventListener.mock.calls[0][1]).toBe(firstHandler);
  });

  it("should handle rapid scroll events", () => {
    const { result } = renderHook(() => useWindowScroll());

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    const scrollEvents = [
      { x: 10, y: 20 },
      { x: 15, y: 25 },
      { x: 20, y: 30 },
      { x: 25, y: 35 },
    ];

    scrollEvents.forEach(({ x, y }) => {
      Object.defineProperty(global.window, "scrollX", {
        value: x,
        writable: true,
      });
      Object.defineProperty(global.window, "scrollY", {
        value: y,
        writable: true,
      });

      act(() => {
        scrollHandler();
      });
    });

    expect(result.current[0]).toEqual({ x: 25, y: 35 });
  });

  it("should handle zero scroll values", () => {
    const { result } = renderHook(() => useWindowScroll());

    const scrollHandler = mockAddEventListener.mock.calls[0][1];

    Object.defineProperty(global.window, "scrollX", {
      value: 100,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 200,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: 100, y: 200 });

    Object.defineProperty(global.window, "scrollX", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(global.window, "scrollY", {
      value: 0,
      writable: true,
    });

    act(() => {
      scrollHandler();
    });

    expect(result.current[0]).toEqual({ x: 0, y: 0 });
  });
});
