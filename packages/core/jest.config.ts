export default async () => ({
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^react$': '<rootDir>/../../node_modules/react'
  }
});
