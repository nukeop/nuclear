export default async () => ({
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^react$': '<rootDir>/../../node_modules/react'
  },
  setupFilesAfterEnv: ['./test/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 100000
});
