# Rangebook

Rangebook tracks reservations for shared resources in memory. A scheduler can reserve a room, list bookings that intersect a time window, and cancel by reservation ID.

```ts
import { ReservationBook } from "./src/index.ts";

const book = new ReservationBook();
book.reserve({ id: "design-sync", resource: "room-4", start: 540, end: 570 });
book.reserve({ id: "standup", resource: "room-4", start: 570, end: 585 });
book.during("room-4", { start: 550, end: 570 }).map(row => row.id);
// ["design-sync"]
```

Use any consistent integer time unit. In this example 540 means 09:00 in minutes after midnight. A booking includes its start and excludes its end, so consecutive bookings may touch. Different resources may use the same time window.

## API

- `reserve(booking)` validates the booking and stores a copy. IDs are unique across the book. Conflicting reservations throw a `ReservationConflict` with the existing booking's ID.
- `get(id)` returns a copy or undefined.
- `during(resource, window)` returns intersecting bookings in start order.
- `cancel(id)` releases a booking and returns whether it existed.

Use Node.js 24 or newer. Run `npm test` from a checkout.
