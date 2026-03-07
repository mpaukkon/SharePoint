import { LoadState } from '../domain/types';

export interface CounterViewModel {
  state: LoadState;
  daysSince?: number;
  latestResetEffectiveDate?: Date;
  message?: string;
  lastUpdatedUtc: string;
}
