export type SignUpRequestBody = {
  username: string;
  email?: string;
  password: string;
};

export type SignUpResponseBody = {};

export type SignInRequestBody = {
  username: string;
  password: string;
};

export type SignInResponseBody = {};
