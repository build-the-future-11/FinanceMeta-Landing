import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

function openingTags(html, tag, role) {
  return [...html.matchAll(new RegExp("<" + tag + "\\b[^>]*>", "g"))]
    .map(([markup]) => Object.fromEntries(
      [...markup.matchAll(/([\\w-]+)(?:="([^"]*)")?/g)]
        .map(([, name, value]) => [name, value ?? ""])
    ))
    .filter(attributes => attributes.role === role);
}

test("program tabs expose persistent named panels and responsive keyboard orientation", async () => {
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const server = await createServer({
    configFile: false,
    appType: "custom",
    logLevel: "error",
    server: { middlewareMode: true, hmr: false, watch: null },
  });
  try {
    // The browser entry may mount only when a real root exists.
    globalThis.document = { getElementById: () => null };
    const { App } = await server.ssrLoadModule("/src/legacy/landing.tsx");

    for (const [width, orientation] of [[1363, "vertical"], [390, "horizontal"]]) {
      const storage = new Map();
      globalThis.window = {
        location: { search: "?fm_qa=1" },
        localStorage: { getItem: () => "light" },
        sessionStorage: {
          getItem: key => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
        matchMedia: query => ({
          matches: query === "(max-width: 820px)" ? width <= 820 : false,
          addEventListener() {},
          removeEventListener() {},
        }),
      };

      const html = renderToStaticMarkup(createElement(App));
      const tablists = openingTags(html, "div", "tablist");
      const tabs = openingTags(html, "button", "tab");
      const panels = openingTags(html, "div", "tabpanel");

      assert.equal(tablists.length, 1);
      assert.equal(tablists[0]["aria-orientation"], orientation);
      assert.equal(tabs.length, 3);
      assert.equal(panels.length, 3, "inactive controls retain real panel targets");
      assert.equal(new Set([...tabs, ...panels].map(item => item.id)).size, 6);
      assert.equal(tabs.filter(tab => tab["aria-selected"] === "true").length, 1);
      assert.equal(panels.filter(panel => !Object.hasOwn(panel, "hidden")).length, 1);

      for (const tab of tabs) {
        assert.ok(tab.id, "every tab has a stable accessible identity");
        const panel = panels.find(item => item.id === tab["aria-controls"]);
        assert.ok(panel, "aria-controls resolves to a panel");
        assert.equal(panel["aria-labelledby"], tab.id);
        assert.equal(panel.tabindex, "0", "introductory text has keyboard entry");
        const selected = tab["aria-selected"] === "true";
        assert.equal(tab.tabindex, selected ? "0" : "-1");
        assert.equal(Object.hasOwn(panel, "hidden"), !selected);
      }
    }
  } finally {
    await server.close();
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
  }
});
