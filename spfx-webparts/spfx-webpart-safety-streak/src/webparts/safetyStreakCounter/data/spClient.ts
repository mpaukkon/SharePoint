export interface ISpHttpClient {
  get<T>(url: string, options?: { headers?: Record<string, string> }): Promise<T>;
}

export interface IHttpError extends Error {
  status?: number;
}

export class FetchSpHttpClient implements ISpHttpClient {
  constructor(private readonly fetchFn: typeof fetch) {}

  async get<T>(url: string, options?: { headers?: Record<string, string> }): Promise<T> {
    const response = await this.fetchFn(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json;odata=nometadata',
        ...options?.headers
      }
    });

    if (!response.ok) {
      const error = new Error(`SharePoint request failed (${response.status}).`) as IHttpError;
      error.status = response.status;
      throw error;
    }

    return (await response.json()) as T;
  }
}
