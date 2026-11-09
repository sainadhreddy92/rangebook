import assert from "node:assert/strict";
import test from "node:test";
import { ReservationBook } from "../src/index.ts";

test("return gaps clipped to the requested window in start order", () => {
  const book = new ReservationBook();
  for (const [start, end] of [[0, 15], [30, 35], [40, 90]]) {
    book.reserve({ id: String(start), resource: "studio", start, end });
  }
  assert.deepEqual(book.freeWindows("studio", { start: 10, end: 50 }, 5), [
    { start: 15, end: 30 }, { start: 35, end: 40 }
  ]);
});

test("filter short gaps and reject invalid duration", () => {
  const book = new ReservationBook();
  const bounds = { start: 10, end: 20 };
  assert.deepEqual(book.freeWindows("studio", bounds, 11), []);
  assert.deepEqual(book.freeWindows("studio", bounds, 10), [bounds]);
  assert.throws(() => book.freeWindows("studio", bounds, 0), RangeError);
});
