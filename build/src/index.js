"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var types_1 = require("./types");
var JSONSummaryReporter = /** @class */ (function () {
    function JSONSummaryReporter() {
        this.durationInMS = -1;
        this.expected = {
            passed: [],
            failed: [],
            skipped: [],
        };
        this.unexpected = {
            passed: [],
            failed: [],
            flaky: [],
            skipped: [],
            interrupted: [],
            timedOut: [],
        };
        this.status = 'unknown';
        this.startedAt = 0;
    }
    JSONSummaryReporter.prototype.onBegin = function () {
        this.startedAt = Date.now();
    };
    JSONSummaryReporter.prototype.onTestEnd = function (test, result) {
        var title = [];
        var fileName = [];
        var clean = true;
        for (var _i = 0, _a = test.titlePath(); _i < _a.length; _i++) {
            var s = _a[_i];
            if (s === '' && clean)
                continue;
            clean = false;
            title.push(s);
            if (s.includes('spec.ts')) {
                fileName.push(s);
            }
        }
        var thisResult = this.getResult(fileName, test, title);
        var status = result.status;
        var outcome = test.outcome();
        switch (outcome) {
            case 'unexpected':
                (0, types_1.assertIsUnexpectedStatus)(status);
                this['unexpected'][status].push(thisResult);
                break;
            case 'flaky':
                this['unexpected']['flaky'].push(thisResult);
                break;
            case 'expected':
                (0, types_1.assertIsExpectedStatus)(status);
                this['expected'][status].push(thisResult);
                break;
            case 'skipped':
                this['expected']['skipped'].push(thisResult);
                break;
            default:
                exhaustiveGuard(outcome);
        }
    };
    JSONSummaryReporter.prototype.getResult = function (fileName, test, title) {
        var _a, _b;
        // the file name + line number test begins on
        var z = "".concat(fileName[0], ":").concat(test.location.line, ":").concat(test.location.column);
        //  a full test name + test description
        var t = title.join(' > ');
        // takes the title array and regex matches the last item for the TR CaseID
        var titleElement = title[title.length - 1];
        // "C", followed by at least 4 numbers, followed by a comma or space, or nothing, repeated
        var caseIdRegex = /(C\d{4,}(,\s?)?)+/g;
        var c = (_b = (_a = titleElement.match(caseIdRegex)) === null || _a === void 0 ? void 0 : _a[0].trim()) !== null && _b !== void 0 ? _b : "No Case ID Found";
        var thisResult = {
            name: t,
            address: z,
            caseId: c,
        };
        return thisResult;
    };
    JSONSummaryReporter.prototype.onEnd = function (result) {
        var filePath = './summary.json';
        this.durationInMS = Date.now() - this.startedAt;
        this.status = result.status;
        fs.writeFileSync(filePath, JSON.stringify(this, null, '  '));
    };
    return JSONSummaryReporter;
}());
exports.default = JSONSummaryReporter;
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
function exhaustiveGuard(_value) {
    throw new Error("ERROR! Reached forbidden guard function with unexpected value: ".concat(JSON.stringify(_value)));
}
