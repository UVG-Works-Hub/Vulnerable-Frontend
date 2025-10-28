import dotenv from 'dotenv';

dotenv.config();

export default {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^.+\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};