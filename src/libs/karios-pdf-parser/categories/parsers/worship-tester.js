import {always, any, find, isNil, pipe, test, unless, when} from "ramda";
import {startsWithGpgOrFt} from "../../utils";

const throwError = msg => () => {
  throw new Error(msg);
};

const makeWorship = (assignedGroup) => ({category: 'worship', assignedGroup});

export const worshipTester = any(test(/^worship/i));

export const worshipParser = pipe(
  unless(worshipTester, throwError('Not worship strings')),
  find(startsWithGpgOrFt),
  when(isNil, always('')),
  makeWorship,
);
