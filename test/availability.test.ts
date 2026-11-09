import assert from "node:assert/strict";
import test from "node:test";
import { availableResources } from "../src/index.ts";

const bounds = { start: 540, end: 570 };

test("filter unavailable rooms and cap simultaneous probes", async () => {
  let active = 0;
  let peak = 0;
  const rooms = ["a", "b", "c", "d"];
  const result = await availableResources(rooms, bounds, async room => {
    peak = Math.max(peak, ++active);
    await new Promise(resolve => setImmediate(resolve));
    active--;
    return room !== "b";
  }, 2);
  assert.equal(peak, 2);
  assert.deepEqual(result, ["a", "c", "d"]);
});

test("reject invalid concurrency before probing", async () => {
  await assert.rejects(availableResources(["a"], bounds, () => assert.fail(), 0), RangeError);
});
