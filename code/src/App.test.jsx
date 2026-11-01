import { describe, expect, it } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { createParticleStage } from "./lib/particleStage";

function open(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("portfolio navigation and features", () => {
  it("opens verified live projects directly from the project section and keeps FlowFund source-only", () => {
    const { container } = open();
    const firstCard = container.querySelector("#projects .work-card");
    expect(
      within(firstCard).getByRole("heading", { level: 3 }).textContent,
    ).toBe("CountCheck");
    expect(within(firstCard).getByText("Inventory & operations")).toBeTruthy();
    expect(
      within(firstCard)
        .getByRole("link", { name: "View CountCheck source code" })
        .getAttribute("href"),
    ).toBe("https://github.com/VJ-veshwikjain2215/CountCheck");
    expect(container.querySelectorAll("#projects .work-card")).toHaveLength(5);
    const expected = {
      CountCheck: "https://countcheck.embarko.app/",
      TrueVoice: "https://veshwik-truevoice.embarko.app/",
      "Secure-Crypt": "https://veshwik-secure-crypt.embarko.app/",
      "Civic Issue Reporter": "https://veshwik-civic-reporter.embarko.app/",
    };
    for (const [name, url] of Object.entries(expected)) {
      const link = screen.getByRole("link", { name: `Open ${name} live site` });
      expect(link.getAttribute("href")).toBe(url);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
    expect(
      screen.queryByRole("link", { name: /Open RupeeRakshak live site/ }),
    ).toBeNull();
    expect(screen.getByText("No public live site")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "View RupeeRakshak source code" })
        .getAttribute("href"),
    ).toBe("https://github.com/VJ-veshwikjain2215/FlowFund");
  });

  it("expands every project on hover or focus without changing project order or row membership", () => {
    const { container } = open();
    const cards = [...container.querySelectorAll("#projects .work-card")];
    const order = cards.map((card) => card.dataset.projectId);
    const rows = [...container.querySelectorAll(".work-row")];
    expect(rows.map((row) => row.children.length)).toEqual([2, 2, 1]);
    for (const card of cards) {
      fireEvent.mouseEnter(card);
      expect(container.querySelectorAll(".work-card.is-expanded")).toHaveLength(
        1,
      );
      expect(card.classList.contains("is-expanded")).toBe(true);
    }
    const focusedLink = cards[1].querySelector("a");
    act(() => focusedLink.focus());
    expect(cards[1].classList.contains("is-expanded")).toBe(true);
    fireEvent.mouseEnter(cards[3]);
    fireEvent.mouseLeave(container.querySelector(".work-grid"));
    expect(cards[1].classList.contains("is-expanded")).toBe(true);
    act(() => focusedLink.blur());
    expect(cards[0].classList.contains("is-expanded")).toBe(true);
    expect(
      [...container.querySelectorAll("#projects .work-card")].map(
        (card) => card.dataset.projectId,
      ),
    ).toEqual(order);
    expect([...container.querySelectorAll(".work-row")]).toEqual(rows);
  });

  it("provides valid home anchors, documents, and safe external links", () => {
    const { container } = open();
    for (const link of container.querySelectorAll(
      'a[href^="#"], a[href^="/#"]',
    )) {
      const id = link.getAttribute("href").split("#")[1];
      expect(
        container.querySelector(`[id="${id}"]`),
        `missing anchor ${id}`,
      ).not.toBeNull();
    }
    expect(
      container.querySelectorAll('a[href="/resume.pdf"]').length,
    ).toBeGreaterThan(0);
    for (const sem of [1, 2, 3])
      expect(
        container.querySelector(
          `a[href="/marksheets/${sem}${sem === 1 ? "st" : sem === 2 ? "nd" : "rd"}_sem.pdf"]`,
        ),
      ).toBeTruthy();
    for (const link of container.querySelectorAll('a[target="_blank"]'))
      expect(link.rel).toContain("noreferrer");
  });

  it("filters the actual tech stack with keyboard-accessible categories", async () => {
    open();
    const user = userEvent.setup();
    const tabs = within(
      screen.getByRole("tablist", { name: "Technology categories" }),
    ).getAllByRole("tab");
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getAllByRole("heading", { level: 3 })).toHaveLength(5);
    expect(within(panel).getAllByRole("listitem")).toHaveLength(18);
    for (const label of panel.querySelectorAll(".tech-label")) {
      expect(label.textContent.trim()).not.toBe("");
      expect(label.querySelector("svg").getAttribute("aria-hidden")).toBe(
        "true",
      );
    }
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs[1].id);
    expect(within(panel).getByText("Kotlin")).toBeTruthy();
    expect(within(panel).queryByText("React")).toBeNull();
    await user.keyboard("{ArrowRight}");
    expect(within(panel).getByRole("heading").textContent).toBe("Interface");
    expect(panel.querySelector(".toolkit-card").dataset.theme).toBe("dark");
    expect(within(panel).getByText("React")).toBeTruthy();
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(tabs[5]);
    expect(within(panel).getByText("GitHub Actions")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(within(panel).getByText("PostgreSQL")).toBeTruthy();
    expect(panel.querySelector(".toolkit-card").dataset.theme).toBe("light");
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(tabs[0]);
    expect(within(panel).getAllByRole("listitem")).toHaveLength(18);
    await user.click(tabs[3]);
    expect(within(panel).getByText("Express")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("4 technologies");
  });

  it("explains outcomes with project evidence rather than repeating the toolkit", async () => {
    open();
    const user = userEvent.setup();
    const section = screen.getByRole("region", {
      name: /Useful outcomes\.\s*Working examples\./,
    });
    const triggers = within(section).getAllByRole("button");
    expect(triggers).toHaveLength(3);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(section.querySelector(".tech-label")).toBeNull();
    const first = document.getElementById(
      triggers[0].getAttribute("aria-controls"),
    );
    const countcheck = within(first).getByRole("link", { name: /CountCheck/ });
    expect(countcheck.getAttribute("href")).toBe("/project/CountCheck");
    expect(
      within(first)
        .getByRole("link", { name: /Civic Issue Reporter/ })
        .getAttribute("href"),
    ).toBe("/project/Civic%20Issue%20Reporter");
    triggers[1].focus();
    await user.keyboard("{Enter}");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
    expect(first.hidden).toBe(true);
    const second = document.getElementById(
      triggers[1].getAttribute("aria-controls"),
    );
    expect(
      within(second)
        .getByRole("link", { name: /Secure-Crypt/ })
        .getAttribute("href"),
    ).toBe("/project/Secure-Crypt");
    await user.click(triggers[2]);
    const third = document.getElementById(
      triggers[2].getAttribute("aria-controls"),
    );
    expect(
      within(third)
        .getByRole("link", { name: /Portfolio contact flow/ })
        .getAttribute("href"),
    ).toBe("/contact");
    await user.keyboard(" ");
    expect(third.hidden).toBe(true);
    expect(within(section).queryByRole("link")).toBeNull();
    await user.click(triggers[0]);
    await user.click(within(first).getByRole("link", { name: /CountCheck/ }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "CountCheck",
    );
  });

  it("toggles navigation and reaches about/contact routes", async () => {
    open();
    const user = userEvent.setup();
    const navigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });
    const navigationLinks = within(navigation).getAllByRole("link");
    expect(navigationLinks.map((link) => link.textContent)).toEqual([
      "Home",
      "About",
      "Toolkit",
      "Capabilities",
      "Projects",
      "Journey",
      "Contact",
    ]);
    expect(navigationLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/#home",
      "/#about",
      "/#skills",
      "/#capabilities",
      "/#projects",
      "/#academics",
      "/contact",
    ]);
    const siteCursor = document.querySelector(".site-cursor");
    const menu = screen.getByRole("button", { name: "Toggle navigation" });
    await user.click(menu);
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    expect(menu.getAttribute("aria-controls")).toBe("main-navigation");
    await user.keyboard("{Escape}");
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(menu);
    await user.click(menu);
    await user.click(document.querySelector("main"));
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    await user.click(menu);
    await user.click(
      within(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).getByRole("link", { name: "Contact" }),
    );
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("textbox", { name: "Subject" })).toBeTruthy();
    expect(document.querySelector(".site-cursor")).toBe(siteCursor);
    await user.click(screen.getByRole("link", { name: "Veshwik Jain home" }));
    await user.click(screen.getByRole("link", { name: /More about Veshwik/i }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "Curious about",
    );
  });

  it("opens FAQ answers, selects hero scenes, respects reduced motion, and releases the engine", async () => {
    const { container, unmount } = open();
    const user = userEvent.setup();
    const summaries = container.querySelectorAll(".faq summary");
    fireEvent.click(summaries[1]);
    await waitFor(() => expect(summaries[1].parentElement.open).toBe(true));
    await user.click(
      screen.getByRole("button", { name: "Show Websites graphic" }),
    );
    expect(
      screen
        .getByRole("button", { name: "Show Websites graphic" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    const call = createParticleStage.mock.calls.at(-1);
    expect(call[1].reducedMotion).toBe(true);
    const stage = createParticleStage.mock.results.at(-1).value;
    await user.click(screen.getByRole("button", { name: "Back to top" }));
    expect(window.scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      behavior: "instant",
    });
    unmount();
    expect(stage.destroy).toHaveBeenCalledOnce();
  });

  it.each([
    ["CountCheck", "https://countcheck.embarko.app/"],
    ["TrueVoice", "https://veshwik-truevoice.embarko.app/"],
    ["Secure-Crypt", "https://veshwik-secure-crypt.embarko.app/"],
    ["Civic Issue Reporter", "https://veshwik-civic-reporter.embarko.app/"],
  ])(
    "supports direct project routes and next-project navigation for %s",
    async (id, url) => {
      open(`/project/${encodeURIComponent(id)}`);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(id);
      expect(
        screen
          .getByRole("link", { name: /OPEN LIVE SITE/ })
          .getAttribute("href"),
      ).toBe(url);
      await userEvent
        .setup()
        .click(screen.getByRole("link", { name: /NEXT PROJECT/ }));
      expect(screen.getByRole("heading", { level: 1 }).textContent).not.toBe(
        id,
      );
    },
  );

  it("explains the missing FlowFund deployment on its detail page", () => {
    open("/project/RupeeRakshak");
    expect(screen.queryByRole("link", { name: /OPEN LIVE SITE/ })).toBeNull();
    expect(screen.getByText(/No public live site is available/)).toBeTruthy();
  });

  it.each(["/project/missing", "/missing"])(
    "recovers from an unknown route: %s",
    async (path) => {
      open(path);
      await userEvent
        .setup()
        .click(screen.getByRole("link", { name: /BACK HOME/i }));
      expect(
        screen.getByRole("tablist", { name: "Technology categories" }),
      ).toBeTruthy();
    },
  );
});
