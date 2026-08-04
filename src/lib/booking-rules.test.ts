import test from "node:test";
import assert from "node:assert/strict";
import {
  intervalsOverlap,
  isWithinBusinessHours,
  parseAppointmentDate,
} from "./booking-rules.ts";

test("parseAppointmentDate rechaza fechas y horas imposibles", () => {
  assert.equal(parseAppointmentDate("2026-02-30", "10:00"), null);
  assert.equal(parseAppointmentDate("2026-08-03", "25:00"), null);
  assert.equal(parseAppointmentDate("03-08-2026", "10:00"), null);
});

test("parseAppointmentDate interpreta los turnos con UTC-3", () => {
  assert.equal(
    parseAppointmentDate("2026-08-03", "10:30")?.toISOString(),
    "2026-08-03T13:30:00.000Z",
  );
  assert.equal(
    parseAppointmentDate("2026-08-03", "23:30")?.toISOString(),
    "2026-08-04T02:30:00.000Z",
  );
});

test("intervalsOverlap detecta cruces, pero permite intervalos contiguos", () => {
  const existing = new Date("2026-08-03T13:00:00.000Z");

  assert.equal(
    intervalsOverlap(
      new Date("2026-08-03T13:30:00.000Z"),
      60,
      existing,
      60,
    ),
    true,
  );
  assert.equal(
    intervalsOverlap(
      new Date("2026-08-03T14:00:00.000Z"),
      30,
      existing,
      60,
    ),
    false,
  );
});

test("isWithinBusinessHours valida límites y grilla", () => {
  assert.equal(isWithinBusinessHours("09:00", 30, "09:00", "18:00"), true);
  assert.equal(isWithinBusinessHours("17:30", 30, "09:00", "18:00"), true);
  assert.equal(isWithinBusinessHours("17:45", 30, "09:00", "18:00"), false);
  assert.equal(isWithinBusinessHours("18:00", 30, "09:00", "18:00"), false);
});
