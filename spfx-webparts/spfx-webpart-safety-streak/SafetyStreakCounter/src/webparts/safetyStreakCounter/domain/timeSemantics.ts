import { TimeSemantics } from './types';

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

const DEFAULT_TIME_ZONE = 'UTC';

export const resolveTimeZone = (timeZone?: string): string => {
  if (!timeZone) {
    return DEFAULT_TIME_ZONE;
  }

  try {
    Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
};

export const getDatePartsInTimeZone = (date: Date, timeZone: string): DateParts => {
  const resolvedZone = resolveTimeZone(timeZone);
  const formatter = Intl.DateTimeFormat('en-US', {
    timeZone: resolvedZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(date);
  const lookup = new Map(parts.map((part) => [part.type, part.value]));

  const year = Number(lookup.get('year'));
  const month = Number(lookup.get('month'));
  const day = Number(lookup.get('day'));

  if (!year || !month || !day) {
    throw new Error('Unable to resolve date parts for timezone conversion.');
  }

  return { year, month, day };
};

export const getDayIndexInTimeZone = (date: Date, timeZone: string): number => {
  const { year, month, day } = getDatePartsInTimeZone(date, timeZone);
  const utcMidnight = Date.UTC(year, month - 1, day);
  return Math.floor(utcMidnight / 86_400_000);
};

export const createTimeSemantics = (timeZone?: string): TimeSemantics => ({
  timeZone: resolveTimeZone(timeZone)
});
