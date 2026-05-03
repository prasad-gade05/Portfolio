import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Hero from "./Hero";

vi.mock("framer-motion", async () => {
  const React = await vi.importActual("react");

  const makeComponent = (tag) =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    );

  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: (_, tag) => makeComponent(tag),
      },
    ),
    useMotionValue: () => ({ set: vi.fn() }),
    useSpring: () => 0,
    animate: () => ({ then: (cb) => Promise.resolve(cb?.()), stop: vi.fn() }),
  };
});

describe("Hero key safety", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.history.replaceState({}, "", "/");
  });

  it("does not emit duplicate key warnings across the assembled hero flow", async () => {
    vi.useFakeTimers();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Hero onStartDoodle={vi.fn()} />);

    for (const label of ["Projects", "About", "Experience", "Achievements", "Volunteer", "Blogs", "Hobbies"]) {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(label, "i") }));
      await vi.runOnlyPendingTimersAsync();
    }

    fireEvent.click(screen.getByRole("button", { name: /open help guide/i }));
    fireEvent.click(screen.getByAltText("Prasad Gade"));
    fireEvent.keyDown(document, { key: "Escape" });

    await vi.runOnlyPendingTimersAsync();

    const duplicateKeyWarnings = consoleErrorSpy.mock.calls.filter(([message]) =>
      String(message).includes("Encountered two children with the same key"),
    );

    expect(duplicateKeyWarnings).toHaveLength(0);
  });
});
