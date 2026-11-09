import assert from "node:assert/strict";
import test from "node:test";
import { ReservationBook } from "../src/index.ts";

test("move a booking to an overlapping replacement window", () => {
  const book = new ReservationBook();
  book.reserve({ id: "review", resource: "green", start: 10, end: 20 });
  const updated = book.reschedule("review", { start: 15, end: 25 });
  assert.deepEqual(updated, { id: "review", resource: "green", start: 15, end: 25 });
  assert.deepEqual(book.during("green", { start: 10, end: 15 }), []);
  assert.deepEqual(book.get("review"), updated);
});

test("reject unknown IDs", () => {
  assert.throws(() => new ReservationBook().reschedule("absent", { start: 2, end: 3 }), /Unknown/);
});
