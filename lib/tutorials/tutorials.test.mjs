import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { mmiTutorial } from "./mmi.ts";
import { readTutorialProgress, tutorialStorageKey, updateTutorialProgress } from "./storage.ts";

const originalWindow = globalThis.window;
afterEach(() => {
    if (originalWindow === undefined) delete globalThis.window;
    else globalThis.window = originalWindow;
});

function storage(initial = {}) {
    const entries = new Map(Object.entries(initial));
    globalThis.window = { localStorage: {
        getItem: (key) => entries.get(key) ?? null,
        setItem: (key, value) => entries.set(key, value),
    } };
    return entries;
}

test("tutorial records are versioned and isolated by account and format", () => {
    storage();
    const first = tutorialStorageKey("user_first", "mmi");
    assert.equal(first, "bedside:tutorial:v1:user_first:mmi");
    updateTutorialProgress(first, "overview", "completed");
    assert.deepEqual(readTutorialProgress(tutorialStorageKey("user_second", "mmi")), { dismissed: false, stages: {} });
    assert.deepEqual(readTutorialProgress(tutorialStorageKey("user_first", "preview")), { dismissed: false, stages: {} });
});

test("finishing one stage leaves subsequent stages eligible and stores only tutorial state", () => {
    const entries = storage();
    const key = "test:completion";
    updateTutorialProgress(key, "overview", "presented");
    updateTutorialProgress(key, "overview", "completed");
    assert.deepEqual(JSON.parse(entries.get(key)), { dismissed: false, stages: { overview: "completed" } });
    assert.equal(readTutorialProgress(key).stages.reading, undefined);
});

test("replay presentation/completion preserves global dismissal and other stages", () => {
    storage();
    const key = "test:replay";
    updateTutorialProgress(key, "overview", "dismissed");
    updateTutorialProgress(key, "reading", "completed");
    updateTutorialProgress(key, "overview", "presented");
    updateTutorialProgress(key, "overview", "completed");
    updateTutorialProgress(key, "overview", "presented");
    assert.deepEqual(readTutorialProgress(key), { dismissed: true, stages: { overview: "completed", reading: "completed" } });
});

test("malformed or invalid storage is safely replaced with valid tutorial state", () => {
    storage({ "test:malformed": "{", "test:invalid": '{"dismissed":false,"stages":{"reading":"unknown"}}' });
    for (const key of ["test:malformed", "test:invalid"]) {
        assert.deepEqual(readTutorialProgress(key), { dismissed: false, stages: {} });
        updateTutorialProgress(key, "reading", "completed");
        assert.equal(readTutorialProgress(key).stages.reading, "completed");
    }
});

test("denied storage retains progress in memory", () => {
    globalThis.window = { get localStorage() { throw new Error("denied"); } };
    updateTutorialProgress("test:denied", "reading", "completed");
    updateTutorialProgress("test:denied", "responding", "dismissed");
    assert.deepEqual(readTutorialProgress("test:denied"), { dismissed: true, stages: { reading: "completed" } });
});

test("a failed write is not undone by a subsequent successful read of stale storage", () => {
    globalThis.window = { localStorage: {
        getItem: () => '{"dismissed":false,"stages":{"reading":"presented"}}',
        setItem: () => { throw new Error("quota"); },
    } };
    updateTutorialProgress("test:quota", "reading", "completed");
    updateTutorialProgress("test:quota", "feedback", "dismissed");
    assert.deepEqual(readTutorialProgress("test:quota"), { dismissed: true, stages: { reading: "completed" } });
});

test("overview targets categories as a group without depending on names", () => {
    const overview = mmiTutorial("overview");
    assert.equal(overview.steps.length, 3);
    assert.equal(overview.steps[0].target, '[data-tour="mmi-station-grid"]');
    assert.equal(overview.steps[1].target, '[data-tour="mmi-station-grid"] [data-tour="station-progress"]');
});

test("optional response timer and hints do not leave nonexistent tutorial steps", () => {
    const untimed = mmiTutorial("responding", { hasResponseTimer: false, hasHints: false });
    assert.equal(untimed.steps.length, 2);
    assert.ok(untimed.steps.every((step) => !step.target.includes("response-timer")));
    assert.doesNotMatch(untimed.steps.at(-1).content, /hint/i);
    const timed = mmiTutorial("responding", { hasResponseTimer: true, hasHints: true });
    assert.equal(timed.steps.length, 3);
    assert.match(timed.steps.at(-1).content, /hint/);
});

test("feedback is one step and safely explains unavailable feedback", () => {
    assert.equal(mmiTutorial("feedback").steps.length, 1);
    const unavailable = mmiTutorial("feedback", { hasFeedback: false });
    assert.match(unavailable.steps[0].content, /isn't available/);
    assert.ok(unavailable.steps.every((step) => !step.target.includes("next-question")));
});
