"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsUnexpectedStatus = exports.assertIsExpectedStatus = void 0;
var testStatuses = [
    'passed',
    'failed',
    'interrupted',
    'timedOut',
    'skipped',
];
function assertIsExpectedStatus(maybeStatus) {
    if (isExpectedStatus(maybeStatus)) {
        throw new Error("Unexpected status: ".concat(maybeStatus));
    }
}
exports.assertIsExpectedStatus = assertIsExpectedStatus;
function assertIsUnexpectedStatus(maybeStatus) {
    if (!isUnexpectedStatus(maybeStatus)) {
        throw new Error("Unexpected status: ".concat(maybeStatus));
    }
}
exports.assertIsUnexpectedStatus = assertIsUnexpectedStatus;
function isExpectedStatus(maybeStatus) {
    return !testStatuses.includes(maybeStatus);
}
function isUnexpectedStatus(maybeStatus) {
    return __spreadArray(__spreadArray([], testStatuses, true), ['flaky'], false).includes(maybeStatus);
}
