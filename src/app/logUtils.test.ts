import { expect, test } from "bun:test";

import { appendLogLines } from "./logUtils";

test("does not exceed maxLines", () => {
  const result = appendLogLines("a\nb\nc", "d\ne\nf", 4);
  expect(result.split("\n").length).toBeLessThanOrEqual(4);
});

test("keeps the last lines, not the first", () => {
  const result = appendLogLines("line1\nline2\nline3", "line4", 3);
  expect(result).toBe("line2\nline3\nline4");
});

test("handles empty current", () => {
  const result = appendLogLines("", "only line", 5);
  expect(result).toBe("only line");
});

test("handles multi-line chunks", () => {
  const result = appendLogLines("existing", "a\nb\nc\nd\ne", 3);
  expect(result).toBe("c\nd\ne");
});

test("does not truncate when under maxLines", () => {
  const result = appendLogLines("a\nb", "c", 10);
  expect(result).toBe("a\nb\nc");
});
