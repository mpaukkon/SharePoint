import { describe, expect, it } from 'vitest';
import { SafetyStreakService } from '../src/webparts/safetyStreakCounter/services/SafetyStreakService';
import { AccessDeniedError, IResetEventsRepository } from '../src/webparts/safetyStreakCounter/data/ResetEventsRepository';

class MockRepository implements IResetEventsRepository {
  constructor(private readonly result: Date | null, private readonly error?: Error) {}

  async getLatestResetEffectiveDate(): Promise<Date | null> {
    if (this.error) {
      throw this.error;
    }

    return this.result;
  }
}

describe('SafetyStreakService', () => {
  it('returns noData when no reset events exist', async () => {
    const service = new SafetyStreakService(new MockRepository(null), {
      timeZone: 'UTC',
      nowProvider: () => new Date(Date.UTC(2026, 2, 6, 0, 0, 0))
    });

    const result = await service.loadCounter('ResetEvents');

    expect(result.state).toBe('noData');
  });

  it('returns noAccess when repository reports access denied', async () => {
    const service = new SafetyStreakService(new MockRepository(null, new AccessDeniedError()), {
      timeZone: 'UTC',
      nowProvider: () => new Date(Date.UTC(2026, 2, 6, 0, 0, 0))
    });

    const result = await service.loadCounter('ResetEvents');

    expect(result.state).toBe('noAccess');
  });

  it('returns success and days since when data exists', async () => {
    const latestReset = new Date(Date.UTC(2026, 2, 5, 23, 0, 0));
    const now = new Date(Date.UTC(2026, 2, 6, 1, 0, 0));
    const service = new SafetyStreakService(new MockRepository(latestReset), {
      timeZone: 'UTC',
      nowProvider: () => now
    });

    const result = await service.loadCounter('ResetEvents');

    expect(result.state).toBe('success');
    expect(result.daysSince).toBe(1);
  });
});
