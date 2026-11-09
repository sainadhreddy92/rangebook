import assert from "node:assert/strict";
import test from "node:test";
import { ReservationBook } from "../src/index.ts";

const first = { id: "a", resource: "hall", start: 10, end: 20 };
const second = { ...first, id: "b", resource: "lobby" };

test("reserve spaces together", () => {
  const book = new ReservationBook();
  book.reserveGroup([first, second]);
  assert.deepEqual(book.get("a"), first);
  assert.deepEqual(book.get("b"), second);
});

test("an existing conflict leaves all new IDs free", () => {
  const book = new ReservationBook();
  book.reserve({ ...second, id: "existing" });
  assert.throws(() => book.reserveGroup([first, second]), /Conflicts/);
  assert.equal(book.get("a"), undefined);
  assert.equal(book.get("b"), undefined);
});
