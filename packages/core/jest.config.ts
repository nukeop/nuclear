export default async () => ({
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^react$': '<rootDir>/../../node_modules/react'
  }
});
