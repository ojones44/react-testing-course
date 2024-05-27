import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// establish API mocking before all tests
beforeAll(() => server.listen());

// reset request handlers after each test so any manipulated data doesn't affect other test
afterEach(() => server.resetHandlers());

// close down the server after all tests have finished
afterAll(() => server.close());
