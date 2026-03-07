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
  const formatter = Intl.DateTimeFormat('en-CA', {
    timeZone: resolvedZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formatted = formatter.format(date);
  const [yearText, monthText, dayText] = formatted.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

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
