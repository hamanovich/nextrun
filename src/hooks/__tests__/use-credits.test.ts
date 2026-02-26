/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCredits, useCreditsRefetch } from "../use-credits";

const mockUseSession = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mockUseSession(),
  },
}));

const mockUseQuery = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: unknown) => mockUseQuery(options),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockAbortSignal = {
  aborted: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
};

const mockAbortController = {
  signal: mockAbortSignal,
  abort: vi.fn(),
};

class MockAbortController {
  signal = mockAbortSignal;
  abort = vi.fn();
}

global.AbortController =
  MockAbortController as unknown as typeof AbortController;

describe("useCredits", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockReturnValue({
      data: 10,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call useQuery with correct parameters when user is authenticated", () => {
    renderHook(() => useCredits());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["credits", "user-123"],
      queryFn: expect.any(Function),
      enabled: true,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  });

  it("should disable query when user is not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    });

    renderHook(() => useCredits());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["credits", undefined],
      queryFn: expect.any(Function),
      enabled: false,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  });

  it("should disable query when user data is missing", () => {
    mockUseSession.mockReturnValue({
      data: { user: null },
      isPending: false,
    });

    renderHook(() => useCredits());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["credits", undefined],
      queryFn: expect.any(Function),
      enabled: false,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  });

  it("should return useQuery result", () => {
    const mockResult = {
      data: 15,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    };

    mockUseQuery.mockReturnValue(mockResult);

    const { result } = renderHook(() => useCredits());

    expect(result.current).toEqual(mockResult);
  });

  it("should handle different user IDs", () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "different-user-456" } },
      isPending: false,
    });

    renderHook(() => useCredits());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["credits", "different-user-456"],
      queryFn: expect.any(Function),
      enabled: true,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  });
});

describe("useCreditsRefetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockReturnValue({
      data: 10,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return refetch function and authentication status", () => {
    const mockRefetch = vi.fn();
    mockUseQuery.mockReturnValue({
      data: 10,
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useCreditsRefetch());

    expect(result.current).toEqual({
      refetchCredits: mockRefetch,
      isAuthenticated: true,
    });
  });

  it("should return false for isAuthenticated when user is not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    });

    const { result } = renderHook(() => useCreditsRefetch());

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should return false for isAuthenticated when user data is missing", () => {
    mockUseSession.mockReturnValue({
      data: { user: null },
      isPending: false,
    });

    const { result } = renderHook(() => useCreditsRefetch());

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should call useCredits internally", () => {
    renderHook(() => useCreditsRefetch());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ["credits", "user-123"],
      queryFn: expect.any(Function),
      enabled: true,
      staleTime: 5 * 60 * 1000,
      retry: 3,
    });
  });
});

describe("fetchCredits function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch credits successfully with number response", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(25),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    const result = await queryFn({ signal: mockAbortController.signal });

    expect(mockFetch).toHaveBeenCalledWith("/api/credits", {
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
      signal: mockAbortController.signal,
    });
    expect(result).toBe(25);
  });

  it("should fetch credits successfully with object response", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ credits: 30 }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    const result = await queryFn({ signal: mockAbortController.signal });

    expect(result).toBe(30);
  });

  it("should return 0 for invalid response format", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ invalid: "data" }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    const result = await queryFn({ signal: mockAbortController.signal });

    expect(result).toBe(0);
  });

  it("should return 0 for null response", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(null),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    const result = await queryFn({ signal: mockAbortController.signal });

    expect(result).toBe(0);
  });

  it("should throw error for HTTP error response", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;

    await expect(
      queryFn({ signal: mockAbortController.signal }),
    ).rejects.toThrow("HTTP error! status: 500");
  });

  it("should throw error for JSON parsing failure", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;

    await expect(
      queryFn({ signal: mockAbortController.signal }),
    ).rejects.toThrow("Failed to parse credits response: Error: Invalid JSON");
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;

    await expect(
      queryFn({ signal: mockAbortController.signal }),
    ).rejects.toThrow("Network error");
  });

  it("should pass abort signal to fetch", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(15),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    await queryFn({ signal: mockAbortController.signal });

    expect(mockFetch).toHaveBeenCalledWith("/api/credits", {
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
      signal: mockAbortController.signal,
    });
  });

  it("should work without abort signal", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(20),
    };
    mockFetch.mockResolvedValue(mockResponse);

    mockUseSession.mockReturnValue({
      data: { user: { id: "user-123" } },
      isPending: false,
    });

    mockUseQuery.mockImplementation(({ queryFn: _queryFn }) => ({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }));

    renderHook(() => useCredits());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn;
    const result = await queryFn({});

    expect(mockFetch).toHaveBeenCalledWith("/api/credits", {
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
      signal: undefined,
    });
    expect(result).toBe(20);
  });
});
