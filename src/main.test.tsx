import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./main";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("member handoff", () => {
  it("renders the configured member portal link directly", () => {
    vi.stubEnv("VITE_MEMBER_APP_URL", "https://finance4all-global-reach.vercel.app/login");
    render(<App />);

    const link = screen.getByRole("link", { name: "Open FinanceMeta member portal" });
    expect(link.getAttribute("data-member-handoff")).toBe("configured");
    expect(link.getAttribute("href")).toBe(
      "https://finance4all-global-reach.vercel.app/login?utm_source=financemeta_landing&utm_medium=cta&utm_campaign=member_handoff",
    );
  });

  it("uses the live FinanceMeta application when no trusted portal origin is configured", () => {
    vi.stubEnv("VITE_MEMBER_APP_URL", "http://localhost:8080/login");
    render(<App />);

    const link = screen.getByRole("link", { name: "Apply to FinanceMeta" });
    expect(link.getAttribute("data-member-handoff")).toBe("fallback");
    expect(link.getAttribute("href")).toBe("https://tally.so/r/5B7blP");
  });
});
