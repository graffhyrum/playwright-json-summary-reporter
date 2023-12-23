import {FullResult, TestResult} from '@playwright/test/reporter';

export interface Summary {
  durationInMS: number;
  expected: Record<ExpectedStatus, CustomTestResult[]>;
  unexpected: Record<UnexpectedStatus, CustomTestResult[]>;
  status: FullResult['status'] | 'unknown' | 'skipped';
}

export type ExpectedStatus = 'passed' | 'failed' | 'skipped';
export type UnexpectedStatus =
  | 'passed'
  | 'failed'
  | 'flaky'
  | 'interrupted'
  | 'skipped'
  | 'timedOut';

export interface CustomTestResult {
  name: string;
  address: string;
  caseId: string;
}

const testStatuses: Readonly<Array<TestResult['status']>> = [
  'passed',
  'failed',
  'interrupted',
  'timedOut',
  'skipped',
] as const;

export function assertIsExpectedStatus(
  maybeStatus: unknown
): asserts maybeStatus is ExpectedStatus {
  if (isExpectedStatus(maybeStatus)) {
    throw new Error(`Unexpected status: ${maybeStatus}`);
  }
}

export function assertIsUnexpectedStatus(
  maybeStatus: unknown
): asserts maybeStatus is UnexpectedStatus {
  if (!isUnexpectedStatus(maybeStatus)) {
    throw new Error(`Unexpected status: ${maybeStatus}`);
  }
}

function isExpectedStatus(maybeStatus: unknown): maybeStatus is ExpectedStatus {
  return !testStatuses.includes(maybeStatus as ExpectedStatus);
}

function isUnexpectedStatus(
  maybeStatus: unknown
): maybeStatus is UnexpectedStatus {
  return [...testStatuses, 'flaky'].includes(maybeStatus as UnexpectedStatus);
}
