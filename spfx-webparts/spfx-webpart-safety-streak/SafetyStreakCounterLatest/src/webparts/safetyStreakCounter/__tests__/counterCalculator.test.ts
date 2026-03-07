import { calculateDaysSinceLatestReset } from '../domain/counterCalculator';

describe('calculateDaysSinceLatestReset', () => {
  it('calculates day difference using timezone boundaries', () => {
    const latestReset = new Date(Date.UTC(2026, 2, 5, 23, 0, 0));
    const now = new Date(Date.UTC(2026, 2, 6, 1, 0, 0));

    const result = calculateDaysSinceLatestReset({
      latestResetEffectiveDate: latestReset,
      now,
      timeSemantics: { timeZone: 'UTC' }
    });

    expect(result.daysSince).toBe(1);
  });

  it('never returns negative values', () => {
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
