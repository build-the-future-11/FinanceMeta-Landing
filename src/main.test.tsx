import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./main";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("member handoff", () => {
  it("renders a safe member portal handoff with attribution", () => {
    render(<App />);

    const link = screen.getByRole("link", { name: /Member portal/i });
    const url = new URL(link.getAttribute("href") ?? "");
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("utm_source")).toBe("financemeta_landing");
    expect(url.searchParams.get("utm_campaign")).toBe("member_handoff");
    expect(url.searchParams.get("fm_session")).toBeTruthy();
  });
});

describe("program pathway tabs", () => {
  it("moves selection with keyboard navigation", async () => {
    render(<App />);

    const learnTab = screen.getByRole("tab", { name: /Learn$/ });
    const experienceTab = screen.getByRole("tab", { name: /Experience$/ });

    expect(learnTab.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(learnTab, { key: "ArrowRight" });

    expect(experienceTab.getAttribute("aria-selected")).toBe("true");
    expect(await screen.findByText("Put ideas under real pressure.")).toBeTruthy();
  });
});
