import { IHttpError, ISpHttpClient } from './spClient';

export class AccessDeniedError extends Error {
  constructor(message = 'Access denied to ResetEvents list.') {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export interface IResetEventsRepository {
  getLatestResetEffectiveDate(listRef: string): Promise<Date | null>;
}

interface ResetEventsResponse {
  value: Array<{ ResetEffectiveDate?: string | null }>;
}

export class ResetEventsRepository implements IResetEventsRepository {
  constructor(private readonly siteUrl: string, private readonly spClient: ISpHttpClient) {}

  async getLatestResetEffectiveDate(listRef: string): Promise<Date | null> {
    const listEndpoint = this.buildListEndpoint(listRef);
    const url = `${listEndpoint}?$select=ResetEffectiveDate&$orderby=ResetEffectiveDate desc&$top=1`;

    try {
      const response = await this.spClient.get<ResetEventsResponse>(url);
      const [item] = response.value ?? [];
      if (!item?.ResetEffectiveDate) {
        return null;
      }

      return new Date(item.ResetEffectiveDate);
    } catch (error) {
      const status = (error as IHttpError).status;
      if (status === 401 || status === 403) {
        throw new AccessDeniedError();
      }

      throw error;
    }
  }

  private buildListEndpoint(listRef: string): string {
    if (listRef.startsWith('http')) {
      return listRef;
    }

    const trimmed = listRef.trim();
    return `${this.siteUrl}/_api/web/lists/GetByTitle('${encodeURIComponent(trimmed)}')/items`;
  }
}
