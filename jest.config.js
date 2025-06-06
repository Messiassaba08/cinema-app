/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-router-dom)/)',
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  };
  