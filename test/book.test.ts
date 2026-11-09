import assert from "node:assert/strict";
import test from "node:test";
import { ReservationBook, ReservationConflict } from "../src/index.ts";

const booking = { id: "retro", resource: "red", start: 10, end: 20 };

test("touching windows can be booked and queries are chronological", () => {
  const book = new ReservationBook();
  book.reserve({ ...booking, id: "later", start: 20, end: 22 });
  book.reserve(booking);
  assert.deepEqual(book.during("red", { start: 19, end: 21 }).map(r => r.id), ["retro", "later"]);
  assert.deepEqual(book.during("red", booking), [booking]);
});

test("conflicts identify the blocking reservation", () => {
  const book = new ReservationBook();
  book.reserve(booking);
  assert.throws(() => book.reserve({ ...booking, id: "clash" }), (error: unknown) =>
    error instanceof ReservationConflict && error.existingId === "retro");
  assert.equal(book.get("clash"), undefined);
});

test("IDs span resources and cancellation releases both indexes", () => {
  const book = new ReservationBook();
  book.reserve(booking);
  assert.throws(() => book.reserve({ ...booking, resource: "blue" }), /Duplicate/);
  assert.equal(book.cancel("retro"), true);
  assert.equal(book.cancel("retro"), false);
  book.reserve({ ...booking, resource: "blue" });
  assert.deepEqual(book.during("red", booking), []);
});

test("callers cannot mutate stored reservations", () => {
  const book = new ReservationBook();
  const input = { ...booking };
  book.reserve(input);
  input.end = 42;
  book.get("retro")!.start = 0;
  book.during("red", booking)[0].resource = "blue";
  assert.deepEqual(book.get("retro"), booking);
});

test("malformed reservations leave the ID available", () => {
  const book = new ReservationBook();
  for (const end of [10, 9, Infinity, 10.5]) {
    assert.throws(() => book.reserve({ ...booking, end }), RangeError);
  }
  book.reserve(booking);
});
