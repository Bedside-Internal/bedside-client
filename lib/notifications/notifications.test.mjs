import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Node's test runner needs TypeScript transpilation to render TSX.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith("@/")) {
            const path = resolve(root, specifier.slice(2));
            const candidate = [path, `${path}.ts`, `${path}.tsx`].find(existsSync);
            if (candidate) return nextResolve(pathToFileURL(candidate).href, context);
        }
        return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
        if (url.endsWith(".tsx") || url.endsWith(".ts")) return {
            format: "module", shortCircuit: true,
            source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
                compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
            }).outputText,
        };
        return nextLoad(url, context);
    },
});
const { newestFirst, notificationAge, safeNotificationHref, updateNotifications } = await import("./state.ts");
const { NotificationBody, NotificationPreview } = await import("../../components/dashboard/NotificationBody.tsx");
const item = (id, read = false, createdAt = "2026-10-28T12:00:00Z") => ({ id, read, readAt: read ? createdAt : null,
    category: "announcement", startsAt: createdAt, expiresAt: null, createdAt, content: { title: id, body: "News" } });
const inbox = () => ({ notifications: [item("one"), item("two", true), item("three")], unreadCount: 2 });

test("reading updates only the selected item and unread count, without mutating the rollback snapshot", () => {
    const before = inbox();
    const after = updateNotifications(before, { type: "read", id: "one" }, "2026-10-28T13:00:00Z");
    assert.equal(after.unreadCount, 1);
    assert.equal(after.notifications[0].read, true);
    assert.equal(after.notifications[0].readAt, "2026-10-28T13:00:00Z");
    assert.equal(before.notifications[0].read, false);
    assert.equal(before.unreadCount, 2);
    assert.equal(updateNotifications(after, { type: "read", id: "one" }).unreadCount, 1);
});
test("dismiss removes the row and subtracts only unread notifications", () => {
    assert.equal(updateNotifications(inbox(), { type: "dismiss", id: "one" }).unreadCount, 1);
    const after = updateNotifications(inbox(), { type: "dismiss", id: "two" });
    assert.equal(after.unreadCount, 2);
    assert.equal(after.notifications.length, 2);
});
test("read-all preserves previous read timestamps, clears badges, and handles an empty inbox", () => {
    const before = inbox();
    const after = updateNotifications(before, { type: "read-all" });
    assert.equal(after.unreadCount, 0);
    assert.ok(after.notifications.every((n) => n.read));
    assert.equal(after.notifications[1].readAt, before.notifications[1].readAt);
    assert.deepEqual(updateNotifications({ notifications: [], unreadCount: 0 }, { type: "read-all" }), { notifications: [], unreadCount: 0 });
});
test("newest-first sort is stable by id and preserves the server response", () => {
    const before = { notifications: [item("old", false, "2026-10-27T12:00:00Z"), item("a"), item("z")], unreadCount: 3 };
    assert.deepEqual(newestFirst(before).notifications.map((n) => n.id), ["z", "a", "old"]);
    assert.equal(before.notifications[0].id, "old");
});
for (const href of ["/dashboard", "/practice?track=mmi#next", "https://bedside.win/help"]) {
    test(`safe link accepts ${href}`, () => assert.equal(safeNotificationHref(href), href));
}
for (const href of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "java\tscript:alert(1)", "vbscript:msgbox(1)", "file:///etc/passwd", "blob:https://bedside.win/id", "data:text/html,hello", "http://evil.test", "//evil.test", "/\\evil.test", "https://u:p@evil.test", "https://evil.test/\npath", "mailto:test@evil.test", "dashboard", undefined]) {
    test(`safe link rejects ${href}`, () => assert.equal(safeNotificationHref(href), undefined));
}
test("relative age needs no timer and clamps future dates", () => {
    const now = Date.parse("2026-10-28T12:00:00Z");
    assert.equal(notificationAge("2026-10-28T12:01:00Z", now), "Just now");
    assert.equal(notificationAge("2026-10-28T11:58:00Z", now), "2 minutes ago");
    assert.equal(notificationAge("2026-10-28T10:00:00Z", now), "2 hours ago");
    assert.equal(notificationAge("2026-10-27T12:00:00Z", now), "yesterday");
});
test("actual Markdown component renders the allowed formatting and safe links", () => {
    const html = renderToStaticMarkup(createElement(NotificationBody, { body: "**Bold** and *emphasis*\n\n- One\n- Two\n\n1. First\n\n[Open](/dashboard)  \nNext" }));
    for (const tag of ["p", "strong", "em", "ul", "ol", "li", "a", "br"]) assert.match(html, new RegExp(`<${tag}[ >/]`));
    assert.match(html, /href="\/dashboard"/);
});
test("actual Markdown component rejects raw HTML, media, unsupported elements and unsafe URLs", () => {
    const body = '<script>alert(1)</script>\n\n<iframe src="https://evil.test"></iframe>\n\n<img src=x onerror="alert(1)">\n\n![image](https://evil.test/image.png)\n\n# Heading\n\n`code`\n\n[Bad](javascript:alert) [HTTP](http://evil.test) [Host](//evil.test) [Good](https://bedside.win/help)';
    const html = renderToStaticMarkup(createElement(NotificationBody, { body }));
    assert.doesNotMatch(html, /<(script|iframe|img|h1|code)\b|onerror=|href="(?:javascript:|http:|\/\/)/);
    assert.match(html, /href="https:\/\/bedside.win\/help"/);
    assert.match(html, /Bad/);
});

test("row previews render inline Markdown without nested links, media or raw formatting markers", () => {
    const html = renderToStaticMarkup(createElement(NotificationPreview, { body: "**News** and [more](/dashboard)\n\n- First\n- Second\n\n![image](https://evil.test/image.png)" }));
    assert.match(html, /<strong>News<\/strong>/);
    assert.match(html, /more/);
    assert.match(html, /First/);
    assert.doesNotMatch(html, /<(p|a|ul|li|img)\b|\*\*News\*\*/);
});

test("Markdown entity-encoded schemes cannot bypass link filtering", () => {
    const html = renderToStaticMarkup(createElement(NotificationBody, {
        body: "[Encoded](jav&#x61;script:alert) [File](file:///etc/passwd) [Blob](blob:https://bedside.win/id)",
    }));
    assert.doesNotMatch(html, /<a\b|href=/);
    assert.match(html, /Encoded/);
});

test("unsupported Markdown preserves heading, quote and code text without their tags", () => {
    const html = renderToStaticMarkup(createElement(NotificationBody, {
        body: "# Heading text\n\n> Quoted **important** text\n\n`inline code`\n\n```\ncode block text\n```",
    }));
    for (const text of ["Heading text", "Quoted", "important", "inline code", "code block text"]) assert.ok(html.includes(text));
    assert.match(html, /<strong>important<\/strong>/);
    assert.doesNotMatch(html, /<(h[1-6]|blockquote|pre|code)\b/);
});
test("unwrapping unsupported Markdown cannot bypass raw HTML, media or link restrictions", () => {
    const html = renderToStaticMarkup(createElement(NotificationBody, {
        body: '# [Unsafe](javascript:alert) and [Safe](/dashboard)\n\n> [Encoded](jav&#x61;script:alert)\n\n<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n![media](https://evil.test/image.png)',
    }));
    assert.match(html, /Unsafe/);
    assert.match(html, /Encoded/);
    assert.match(html, /href="\/dashboard"/);
    assert.doesNotMatch(html, /<(h[1-6]|blockquote|script|img|iframe)\b|onerror=|href="(?:javascript:|data:|http:|\/\/)/);
});
