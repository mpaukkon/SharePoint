export class AccessDeniedError extends Error {
  constructor(message = 'Access denied to ResetEvents list.') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export interface IResetEventsRepository {
  getLatestResetEffectiveDate(listRef: string): Promise<Date | undefined>;
}
