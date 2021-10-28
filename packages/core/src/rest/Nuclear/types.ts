export type RequestResult<TResponseBody, TErrorBody> = {
    body: TResponseBody | TErrorBody;
    ok: boolean;
    status: number;
  };

export type ErrorBody = {
  message: string;
};
