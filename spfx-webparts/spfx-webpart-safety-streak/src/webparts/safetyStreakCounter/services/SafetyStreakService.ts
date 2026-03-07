import { calculateDaysSinceLatestReset } from '../domain/counterCalculator';
import { createTimeSemantics } from '../domain/timeSemantics';
import { CounterViewModel } from '../models/CounterViewModel';
import { AccessDeniedError, IResetEventsRepository } from '../data/ResetEventsRepository';

export interface SafetyStreakServiceOptions {
  timeZone?: string;
  nowProvider?: () => Date;
}

export class SafetyStreakService {
  private readonly repository: IResetEventsRepository;
  private readonly nowProvider: () => Date;
  private readonly timeZone?: string;

  constructor(repository: IResetEventsRepository, options: SafetyStreakServiceOptions = {}) {
    this.repository = repository;
    this.timeZone = options.timeZone;
    this.nowProvider = options.nowProvider ?? (() => new Date());
  }

  async loadCounter(listRef: string): Promise<CounterViewModel> {
    const now = this.nowProvider();

    try {
      const latestReset = await this.repository.getLatestResetEffectiveDate(listRef);

      if (!latestReset) {
        return {
          state: 'noData',
          message: 'No reset events found.',
          lastUpdatedUtc: now.toISOString()
        };
      }

      const calculation = calculateDaysSinceLatestReset({
        latestResetEffectiveDate: latestReset,
        now,
        timeSemantics: createTimeSemantics(this.timeZone)
      });

      return {
        state: 'success',
        daysSince: calculation.daysSince,
        latestResetEffectiveDate: calculation.latestResetEffectiveDate,
        lastUpdatedUtc: calculation.calculationDate.toISOString()
      };
    } catch (error) {
      if (error instanceof AccessDeniedError) {
        return {
          state: 'noAccess',
          message: 'Access to the ResetEvents list is not available.',
          lastUpdatedUtc: now.toISOString()
        };
      }

      return {
        state: 'error',
        message: 'Unable to load Safety Streak Counter data.',
        lastUpdatedUtc: now.toISOString()
      };
    }
  }
}
