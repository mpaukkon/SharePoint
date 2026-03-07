import { SafetyStreakService } from '../services/SafetyStreakService';
import { AccessDeniedError, IResetEventsRepository } from '../data/ResetEventsRepositoryTypes';

class MockRepository implements IResetEventsRepository {
  constructor(private readonly result: Date | undefined, private readonly error?: Error) {}

  async getLatestResetEffectiveDate(): Promise<Date | undefined> {
    if (this.error) {
      throw this.error;
    }

    return this.result;
  }
}

describe('SafetyStreakService', () => {
  it('returns noData when no reset events exist', async () => {
  const service = new SafetyStreakService(new MockRepository(undefined), {
      timeZone: 'UTC',
      nowProvider: () => new Date(Date.UTC(2026, 2, 6, 0, 0, 0))
    });

    const result = await service.loadCounter('ResetEvents');

    expect(result.state).toBe('noData');
  });

  it('returns noAccess when repository reports access denied', async () => {
  const service = new SafetyStreakService(new MockRepository(undefined, new AccessDeniedError()), {
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
