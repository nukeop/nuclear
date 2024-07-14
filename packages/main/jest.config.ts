export default async () => ({
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },
  setupFilesAfterEnv: ['./tests/jest-setup.ts']
});
