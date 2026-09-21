const RELATIVE_UNITS: Array<
  [Intl.RelativeTimeFormatUnit, number]
> = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function formatRelativeTime(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const seconds = (date.getTime() - Date.now()) / 1000;
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  for (const [unit, unitSeconds] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= unitSeconds || unit === "second") {
      return formatter.format(
        Math.round(seconds / unitSeconds),
        unit
      );
    }
  }

  return formatter.format(0, "second");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en").format(value);
}

export function formatDateTime(
  value: string | null | undefined
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function toEpoch(
  value: string | Date | number | null | undefined,
  fallback: number
): number {
  if (!value) {
    return fallback;
  }

  const timestamp =
    value instanceof Date
      ? value.getTime()
      : typeof value === "number"
        ? value
        : new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return fallback;
  }

  return timestamp;
}

export function formatDuration(
  start: string | Date | null | undefined,
  end: string | Date | number = Date.now()
): string {
  const startMs = toEpoch(start, end as number);

  if (startMs > (end as number)) {
    return "now";
  }

  const totalSeconds = Math.max(
    0,
    Math.floor(((end as number) - startMs) / 1000)
  );

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${totalSeconds}s`;
}
