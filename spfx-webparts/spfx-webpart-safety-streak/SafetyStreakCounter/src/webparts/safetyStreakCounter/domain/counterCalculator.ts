import { CounterCalculationInput, CounterCalculationResult } from './types';
import { getDayIndexInTimeZone } from './timeSemantics';

export const calculateDaysSinceLatestReset = ({
  latestResetEffectiveDate,
  now,
  timeSemantics
}: CounterCalculationInput): CounterCalculationResult => {
  const nowIndex = getDayIndexInTimeZone(now, timeSemantics.timeZone);
  const resetIndex = getDayIndexInTimeZone(latestResetEffectiveDate, timeSemantics.timeZone);
  const rawDiff = nowIndex - resetIndex;

  return {
    daysSince: Math.max(0, rawDiff),
    latestResetEffectiveDate,
    calculationDate: now
  };
};
