/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.js', '**/*.spec.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
    '!src/**/index.js',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  fakeTimers: {
    enableGlobally: false,
    legacyFakeTimers: true,
  },
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@processors/(.*)$': '<rootDir>/src/processors/$1',
  },
  setupFilesAfterSetup: ['<rootDir>/test/setup.js'],
  transform: {},
  verbose: true,
  testTimeout: 10000,
};
