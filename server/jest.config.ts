import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    modulePathIgnorePatterns: ['<rootDir>/dist'],
    testTimeout: 10000,
};

export default config;
