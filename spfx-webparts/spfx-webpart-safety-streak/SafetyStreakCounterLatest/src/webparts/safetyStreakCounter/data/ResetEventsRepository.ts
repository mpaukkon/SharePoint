import { SPHttpClient } from '@microsoft/sp-http';
import { AccessDeniedError, IResetEventsRepository } from './ResetEventsRepositoryTypes';

interface ResetEventsResponse {
  value: Array<{ ResetEffectiveDate?: string }>;
}

export class ResetEventsRepository implements IResetEventsRepository {
  constructor(private readonly siteUrl: string, private readonly spHttpClient: SPHttpClient) {}

  async getLatestResetEffectiveDate(listRef: string): Promise<Date | undefined> {
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
      return undefined;
    }

    return new Date(item.ResetEffectiveDate);
  }

  private buildListEndpoint(listRef: string): string {
    if (listRef.startsWith('http')) {
      return listRef;
    }

    const trimmed = listRef.trim();
    if (this.isGuid(trimmed)) {
      const normalized = trimmed.replace(/[{}]/g, '');
      return `${this.siteUrl}/_api/web/lists(guid'${normalized}')/items`;
    }

    return `${this.siteUrl}/_api/web/lists/GetByTitle('${encodeURIComponent(trimmed)}')/items`;
  }

  private isGuid(value: string): boolean {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value.replace(/[{}]/g, ''));
  }
}
