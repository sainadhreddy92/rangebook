export interface TimeWindow {
  start: number;
  end: number;
}

export interface Reservation extends TimeWindow {
  id: string;
  resource: string;
}

export function validateWindow(window: TimeWindow): void {
  if (!Number.isSafeInteger(window.start) || !Number.isSafeInteger(window.end)) {
    throw new RangeError("Time bounds must be safe integers");
  }
  if (window.start >= window.end) {
    throw new RangeError("Start must precede end");
  }
}

export function overlaps(left: TimeWindow, right: TimeWindow): boolean {
  return left.start < right.end && right.start < left.end;
}
