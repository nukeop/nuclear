export default async () => ({
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!youtubei.js|jintr)',
    '<rootDir>/../../node_modules/youtubei.js'
  ],
  moduleNameMapper: {
    '^react$': '<rootDir>/../../node_modules/react',
    '@bufbuild/protobuf': '<rootDir>/../../node_modules/@bufbuild/protobuf'
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/jest-setup.ts']
});
