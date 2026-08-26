import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("生理学第4至6章包含规划的高频知识点", () => {
  const source = fs.readFileSync(new URL("../src/data/physiol.ts", import.meta.url), "utf8");
  const expected = { p4: 8, p5: 7, p6: 7 };
  for (const [id, count] of Object.entries(expected)) {
    const matches = source.match(new RegExp(`examPoint\\("ph${id.slice(1)}-\\d+"`, "g")) ?? [];
    assert.equal(matches.length, count, `${id} 应有 ${count} 个知识点`);
  }
});
