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
      let result: Response;
      let body;
      
      try {
        result = await request;
        body = await result.json();
      } catch (err) {
        body = undefined;
      }
    
      if (result.ok) {
        return {
          body: body as TResponseBody ?? null,
          status: result.status,
          ok: result.ok
        };
      } else {
        return {
          body: body as TErrorBody ?? null,
          status: result.status,
          ok: result.ok
        };
      }
    }
}

export const isResponseBody = <TResponseBody, TErrorBody>(
  result: RequestResult<TResponseBody, TErrorBody>
): result is RequestResult<TResponseBody, never> => result.ok;
