export type LayoutType = 'Ritual' | 'Context' | 'Display';

export type LoadState = 'success' | 'noData' | 'noAccess' | 'error' | 'loading';

export interface TimeSemantics {
  timeZone: string;
}

export interface CounterCalculationInput {
  latestResetEffectiveDate: Date;
  now: Date;
  timeSemantics: TimeSemantics;
}

export interface CounterCalculationResult {
  daysSince: number;
  latestResetEffectiveDate: Date;
  calculationDate: Date;
}
