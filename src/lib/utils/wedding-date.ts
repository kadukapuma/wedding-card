/**
 * Wedding dates arrive either as ISO ("2026-10-18", from the database) or as
 * prose ("Sunday, 18th October 2026"). Everything is read as Sri Lanka time and
 * formatted by hand so server and browser render identical text.
 */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export interface CalendarDay {
  year: number;
  month: number; // 1-12
  day: number;
  monthName: string;
  weekday: string;
}

export function parseCalendarDay(value: string): CalendarDay | null {
  const text = value.replace(/(\d+)(st|nd|rd|th)\b/gi, "$1");
  const monthFromName = (name: string) =>
    MONTHS.findIndex((m) => m.toLowerCase().startsWith(name.slice(0, 3).toLowerCase())) + 1;

  let year = 0;
  let month = 0;
  let day = 0;
  let match: RegExpMatchArray | null;

  if ((match = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/))) {
    [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  } else if ((match = text.match(/(\d{1,2})\s+([A-Za-z]{3,}),?\s+(\d{4})/))) {
    [day, month, year] = [Number(match[1]), monthFromName(match[2]), Number(match[3])];
  } else if ((match = text.match(/([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{4})/))) {
    [month, day, year] = [monthFromName(match[1]), Number(match[2]), Number(match[3])];
  }

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;

  return {
    year,
    month,
    day,
    monthName: MONTHS[month - 1],
    weekday: WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()],
  };
}

export function formatLongDate(value: string): string {
  const d = parseCalendarDay(value);
  return d ? `${d.weekday}, ${d.day} ${d.monthName} ${d.year}` : value;
}

/** Epoch milliseconds of the ceremony, or null if the date can't be read. */
export function ceremonyTimestamp(date: string, time?: string): number | null {
  const d = parseCalendarDay(date);
  if (!d) return null;

  let hours = 9;
  let minutes = 0;
  const t = time?.match(/(\d{1,2})[:.](\d{2})\s*([ap])?/i);
  if (t) {
    hours = Number(t[1]);
    minutes = Number(t[2]);
    const meridiem = t[3]?.toLowerCase();
    if (meridiem) hours = (hours % 12) + (meridiem === "p" ? 12 : 0);
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = Date.parse(
    `${d.year}-${pad(d.month)}-${pad(d.day)}T${pad(hours)}:${pad(minutes)}:00+05:30`,
  );
  return Number.isNaN(stamp) ? null : stamp;
}

export function googleCalendarUrl(options: {
  title: string;
  location: string;
  date: string;
  time?: string;
}): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: options.title,
    location: options.location,
  });
  const start = ceremonyTimestamp(options.date, options.time);
  if (start !== null) {
    const compact = (ms: number) =>
      new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    params.set("dates", `${compact(start)}/${compact(start + 5 * 60 * 60 * 1000)}`);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
