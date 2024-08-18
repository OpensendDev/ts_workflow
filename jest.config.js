module.exports = {
  roots: ['<rootDir>/src'],
  // transform: {
  //   '^.+\\.ts$': 'ts-jest'
  // },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // coverageThreshold: {
  //   global: {
  //     branches: 30,
  //     functions: 30,
  //     lines: 30
  //   }
  // },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.(interface|constant|model|enum|type).{ts,js}',
    '!**/__mocks__/**',
    '!**/node_modules/**'
  ]
};