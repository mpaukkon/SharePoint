import { describe, expect, it } from 'vitest';
import { calculateDaysSinceLatestReset } from '../src/webparts/safetyStreakCounter/domain/counterCalculator';

describe('calculateDaysSinceLatestReset', () => {
  it('calculates day difference using timezone day boundaries', () => {
    const latestReset = new Date(Date.UTC(2026, 2, 5, 23, 0, 0));
    const now = new Date(Date.UTC(2026, 2, 6, 1, 0, 0));

    const result = calculateDaysSinceLatestReset({
      latestResetEffectiveDate: latestReset,
      now,
      timeSemantics: { timeZone: 'UTC' }
    });

    expect(result.daysSince).toBe(1);
  });

  it('respects local timezone boundaries', () => {
    const latestReset = new Date(Date.UTC(2026, 2, 6, 3, 0, 0));
    const now = new Date(Date.UTC(2026, 2, 6, 4, 0, 0));

    const result = calculateDaysSinceLatestReset({
      latestResetEffectiveDate: latestReset,
      now,
      timeSemantics: { timeZone: 'America/New_York' }
    });

    expect(result.daysSince).toBe(0);
  });

  it('never returns negative values for future resets', () => {
    const latestReset = new Date(Date.UTC(2026, 2, 7, 0, 0, 0));
    const now = new Date(Date.UTC(2026, 2, 6, 0, 0, 0));

    const result = calculateDaysSinceLatestReset({
      latestResetEffectiveDate: latestReset,
      now,
      timeSemantics: { timeZone: 'UTC' }
    });

    expect(result.daysSince).toBe(0);
  });
});
