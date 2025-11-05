/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!nanoid)'],
  
  // ROOT FIX: Exclude Playwright tests from Jest
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',           // Exclude E2E tests
    '/tests/accessibility/',  // Exclude accessibility tests
    '/.next/',
    '/dist/',
  ],
  
  // Only run tests in __tests__ directory
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
  ],
}