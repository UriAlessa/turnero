const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TURNERO_TIME_ZONE_OFFSET = "-03:00";

export function parseAppointmentDate(date: string, time: string) {
  if (!DATE_PATTERN.test(date) || !TIME_PATTERN.test(time)) {
    return null;
  }

  const startsAt = new Date(`${date}T${time}:00${TURNERO_TIME_ZONE_OFFSET}`);
  const [year, month, day] = date.split("-").map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    Number.isNaN(startsAt.getTime()) ||
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() + 1 !== month ||
    calendarDate.getUTCDate() !== day
  ) {
    return null;
  }

  return startsAt;
}

export function intervalsOverlap(
  candidateStart: Date,
  candidateDurationMin: number,
  appointmentStart: Date,
  appointmentDurationMin: number,
) {
  const candidateEnd = new Date(
    candidateStart.getTime() + candidateDurationMin * 60_000,
  );
  const appointmentEnd = new Date(
    appointmentStart.getTime() + appointmentDurationMin * 60_000,
  );

  return candidateStart < appointmentEnd && candidateEnd > appointmentStart;
}

export function isWithinBusinessHours(
  time: string,
  durationMin: number,
  startTime: string,
  endTime: string,
) {
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };

  if (
    !TIME_PATTERN.test(time) ||
    !TIME_PATTERN.test(startTime) ||
    !TIME_PATTERN.test(endTime) ||
    !Number.isInteger(durationMin) ||
    durationMin <= 0
  ) {
    return false;
  }

  const requestedStart = toMinutes(time);
  const opening = toMinutes(startTime);
  const closing = toMinutes(endTime);

  return (
    requestedStart >= opening &&
    requestedStart + durationMin <= closing &&
    (requestedStart - opening) % durationMin === 0
  );
}
