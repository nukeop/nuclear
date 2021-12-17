import { isEmpty, pickBy } from 'lodash';
import { RequestResult } from './types';

export abstract class NuclearService {
    protected _token: string;
    constructor(protected baseUrl: string) {}

    public set token(token: string) {
      this._token = token;
    }

    getHeaders() {
      return {
        'Content-type': 'application/json'
      };
    }

    prepareBody<TRequestBody extends object>(body: TRequestBody) {
      return pickBy(body, value => !isEmpty(value));
    }

    async getJson<TResponseBody, TErrorBody>(
      request: Promise<Response>
    ): Promise<RequestResult<TResponseBody, TErrorBody>> {
      const result = await request;
      const body = await result.json();
    
      if (result.ok) {
        return {
          body: body as TResponseBody,
          status: result.status,
          ok: result.ok
        };
      } else {
        return {
          body: body as TErrorBody,
          status: result.status,
          ok: result.ok
        };
      }
    }
}
