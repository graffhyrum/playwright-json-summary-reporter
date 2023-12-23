import * as fs from 'fs';
import {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import {
  assertIsExpectedStatus,
  assertIsUnexpectedStatus,
  CustomTestResult,
  ExpectedStatus,
  Summary,
  UnexpectedStatus
} from "./types";


class JSONSummaryReporter implements Reporter, Summary {
  durationInMS = -1;
  expected: Record<ExpectedStatus, CustomTestResult[]> = {
    passed: [],
    failed: [],
    skipped: [],
  };
  unexpected: Record<UnexpectedStatus, CustomTestResult[]> = {
    passed: [],
    failed: [],
    flaky: [],
    skipped: [],
    interrupted: [],
    timedOut: [],
  };
  status: Summary['status'] = 'unknown';
  startedAt = 0;

  onBegin() {
    this.startedAt = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const title = [];
    const fileName = [];
    let clean = true;
    for (const s of test.titlePath()) {
      if (s === '' && clean) continue;
      clean = false;
      title.push(s);
      if (s.includes('spec.ts')) {
        fileName.push(s);
      }
    }
    const thisResult = this.getResult(fileName, test, title);

    const status = result.status;
    const outcome = test.outcome();
    switch (outcome) {
      case 'unexpected':
        assertIsUnexpectedStatus(status);
        this['unexpected'][status].push(thisResult);
        break;
      case 'flaky':
        this['unexpected']['flaky'].push(thisResult);
        break;
      case 'expected':
        assertIsExpectedStatus(status);
        this['expected'][status].push(thisResult);
        break;
      case 'skipped':
        this['expected']['skipped'].push(thisResult);
        break;
      default:
        exhaustiveGuard(outcome);
    }
  }

  private getResult(fileName: any[], test: TestCase, title: any[]) {
    // the file name + line number test begins on
    const z = `${fileName[0]}:${test.location.line}:${test.location.column}`;

    //  a full test name + test description
    const t = title.join(' > ');

    // takes the title array and regex matches the last item for the TR CaseID
    const titleElement = title[title.length - 1];
    // "C", followed by at least 4 numbers, followed by a comma or space, or nothing, repeated
    const caseIdRegex = /(C\d{4,}(,\s?)?)+/g;
    const c = titleElement.match(caseIdRegex)?.[0].trim() ?? "No Case ID Found";
    const thisResult: CustomTestResult = {
      name: t,
      address: z,
      caseId: c,
    };
    return thisResult;
  }

  onEnd(result: FullResult) {
    const filePath = './summary.json';
    this.durationInMS = Date.now() - this.startedAt;
    this.status = result.status;

    fs.writeFileSync(filePath, JSON.stringify(this, null, '  '));
  }
}

export default JSONSummaryReporter;


/**
 * This function is used to exhaustively check for all possible values of a union type.
 * It is used in a switch statement to ensure that all possible values of a union type are
 * handled. If a new value is added to the union type, the compiler will complain that the
 * switch statement is not exhaustive.
 * @example
 * type MyUnion = 'a' | 'b' | 'c';
 * const myUnion: MyUnion = 'a';
 * switch (myUnion) {
 *  case 'a':
 *  // do something
 *  break;
 *  case 'b':
 *  // do something
 *  break;
 *  case 'c':
 *  // do something
 *  break;
 *  default:
 *  exhaustiveGuard(myUnion); // this will throw a compiler error if a new value is added to MyUnion
 *  break;
 *  }
 */
function exhaustiveGuard(_value: never): never {
  throw new Error(
    `ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(
      _value
    )}`
  );
}
