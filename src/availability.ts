import { validateWindow } from "./window.ts";
import type { TimeWindow } from "./window.ts";

export type AvailabilityProbe = (resource: string, bounds: TimeWindow) => Promise<boolean>;

export async function availableResources(
  resources: readonly string[],
  window: TimeWindow,
  probe: AvailabilityProbe,
  concurrency = 4,
): Promise<string[]> {
  validateWindow(window);
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new RangeError("Concurrency must be a positive integer");
  }

  const available: string[] = [];
  let next = 0;
  async function run(): Promise<void> {
    while (next < resources.length) {
      const resource = resources[next++];
      if (await probe(resource, { ...window })) available.push(resource);
    }
  }
  const workers = Array.from({ length: Math.min(resources.length, concurrency) }, run);
  await Promise.all(workers);
  return available;
}
