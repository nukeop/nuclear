import { has } from 'lodash';

export type RequestResult<TResponseBody, TErrorBody> = {
  body: TResponseBody | TErrorBody;
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
