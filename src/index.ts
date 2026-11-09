import { overlaps, validateWindow } from "./window.ts";
import type { Reservation, TimeWindow } from "./window.ts";
export type { Reservation, TimeWindow } from "./window.ts";

export class ReservationConflict extends Error {
  readonly existingId: string;

  constructor(existingId: string) {
    super(`Conflicts with reservation ${existingId}`);
    this.name = "ReservationConflict";
    this.existingId = existingId;
  }
}

export class ReservationBook {
  private byId = new Map<string, Reservation>();
  private byResource = new Map<string, Reservation[]>();

  reserve(input: Reservation): void {
    validateWindow(input);
    if (!input.id.trim() || !input.resource.trim()) {
      throw new TypeError("ID and resource must be nonempty");
    }
    if (this.byId.has(input.id)) {
      throw new Error(`Duplicate reservation ID: ${input.id}`);
    }

    const rows = this.byResource.get(input.resource) ?? [];
    const conflict = rows.find(row => overlaps(row, input));
    if (conflict) throw new ReservationConflict(conflict.id);

    const stored = { ...input };
    const next = rows.findIndex(row => row.start > stored.start);
    rows.splice(next === -1 ? rows.length : next, 0, stored);
    this.byResource.set(stored.resource, rows);
    this.byId.set(stored.id, stored);
  }

  get(id: string): Reservation | undefined {
    const row = this.byId.get(id);
    return row && { ...row };
  }

  during(resource: string, window: TimeWindow): Reservation[] {
    validateWindow(window);
    const rows = this.byResource.get(resource) ?? [];
    return rows.filter(row => overlaps(row, window)).map(row => ({ ...row }));
  }

  cancel(id: string): boolean {
    const row = this.byId.get(id);
    if (!row) return false;

    const rows = this.byResource.get(row.resource)!;
    rows.splice(rows.indexOf(row), 1);
    if (rows.length === 0) this.byResource.delete(row.resource);
    return this.byId.delete(id);
  }
}
export { availableResources, type AvailabilityProbe } from "./availability.ts";
