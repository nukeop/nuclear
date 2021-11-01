export enum UserAccountState {
  UNCONFIRMED = 'UNCONFIRMED',
  CONFIRMED = 'CONFIRMED',
  DISABLED = 'DISABLED',
}

export type SignUpRequestBody = {
  username: string;
  email?: string;
  password: string;
};

export type SignUpResponseBody = {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  accountState: UserAccountState;
  createdAt: string;
  updatedAt: string;
};

export type SignInRequestBody = {
  username: string;
  password: string;
};

export type SignInResponseBody = {
  expiresIn: number;
  token: string;
  user: SignUpResponseBody;
};
