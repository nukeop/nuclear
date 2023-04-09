import { has } from 'lodash';

export type RequestResult<TResponseBody, TErrorBody> = {
  body: TResponseBody | TErrorBody | null;
  ok: boolean;
  status: number;
};

export type ErrorBody = {
  message: string;
  errors: {
    message: string;
    path: string;
  }[];
};

export const isErrorBody = (
  body: unknown
): body is ErrorBody => {
  return has(body, 'errors');
};

export type SupabaseResponse<T> = {
  data: T;
  count: number;
  error: string;
  status: number;
  statusText: string;
}
