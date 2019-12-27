export enum Env {
  PROD = 'production',
  DEV = 'development',
  TEST = 'test'
}

const isDev = process.env.NODE_ENV === Env.DEV;
const isProd = process.env.NODE_ENV === Env.PROD;
const isTest = process.env.NODE_ENV === Env.TEST;

export {
  isDev,
  isProd,
  isTest
};
