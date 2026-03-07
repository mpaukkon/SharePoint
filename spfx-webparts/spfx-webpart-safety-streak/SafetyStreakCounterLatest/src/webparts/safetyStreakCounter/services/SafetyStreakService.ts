import { calculateDaysSinceLatestReset } from '../domain/counterCalculator';
import { createTimeSemantics } from '../domain/timeSemantics';
import { CounterViewModel } from '../models/CounterViewModel';
import { AccessDeniedError, IResetEventsRepository } from '../data/ResetEventsRepositoryTypes';

export interface SafetyStreakServiceOptions {
  timeZone?: string;
  nowProvider?: () => Date;
  messages?: {
    noData: string;
    noAccess: string;
    error: string;
  };
}

export class SafetyStreakService {
  private readonly repository: IResetEventsRepository;
  private readonly nowProvider: () => Date;
  private readonly timeZone?: string;
  private readonly messages?: SafetyStreakServiceOptions['messages'];

  constructor(repository: IResetEventsRepository, options: SafetyStreakServiceOptions = {}) {
    this.repository = repository;
    this.timeZone = options.timeZone;
    this.nowProvider = options.nowProvider ?? (() => new Date());
    this.messages = options.messages;
  }

  async loadCounter(listRef: string): Promise<CounterViewModel> {
    const now = this.nowProvider();

    try {
      const latestReset = await this.repository.getLatestResetEffectiveDate(listRef);

      if (!latestReset) {
        return {
          state: 'noData',
          message: this.messages?.noData ?? 'No reset events found.',
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
      if (error instanceof AccessDeniedError || (error as Error)?.name === 'AccessDeniedError') {
        return {
          state: 'noAccess',
          message: this.messages?.noAccess ?? 'Access to the ResetEvents list is not available.',
          lastUpdatedUtc: now.toISOString()
        };
      }

      return {
        state: 'error',
        message: this.messages?.error ?? 'Unable to load Safety Streak Counter data.',
        lastUpdatedUtc: now.toISOString()
      };
    }
  }
}
