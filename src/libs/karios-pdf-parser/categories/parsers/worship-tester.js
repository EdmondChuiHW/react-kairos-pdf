import {always, any, find, isNil, pipe, test, unless, when} from "ramda";

const throwError = msg => () => {
  throw new Error(msg);
};

const makeWorship = (assignedGroup) => ({category: 'worship', assignedGroup});

const startsWithGpgOrFt = test(/^(?:ft)|^(?:gpg)/i);

export const worshipTester = any(test(/^worship/i));

export const worshipParser = pipe(
  unless(worshipTester, throwError('Not worship strings')),
  find(startsWithGpgOrFt),
  when(isNil, always('')),
  makeWorship,
);
