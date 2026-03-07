import { SPHttpClient } from '@microsoft/sp-http';

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
  constructor(private readonly siteUrl: string, private readonly spHttpClient: SPHttpClient) {}

  async getLatestResetEffectiveDate(listRef: string): Promise<Date | null> {
    const listEndpoint = this.buildListEndpoint(listRef);
    const url = `${listEndpoint}?$select=ResetEffectiveDate&$orderby=ResetEffectiveDate desc&$top=1`;

    const response = await this.spHttpClient.get(url, SPHttpClient.configurations.v1, {
      headers: { Accept: 'application/json;odata=nometadata' }
    });

    if (response.status === 401 || response.status === 403) {
      throw new AccessDeniedError();
    }

    if (!response.ok) {
      throw new Error(`SharePoint request failed (${response.status}).`);
    }

    const payload = (await response.json()) as ResetEventsResponse;
    const [item] = payload.value ?? [];
    if (!item?.ResetEffectiveDate) {
      return null;
    }

    return new Date(item.ResetEffectiveDate);
  }

  private buildListEndpoint(listRef: string): string {
    if (listRef.startsWith('http')) {
      return listRef;
    }

    const trimmed = listRef.trim();
    return `${this.siteUrl}/_api/web/lists/GetByTitle('${encodeURIComponent(trimmed)}')/items`;
  }
}
