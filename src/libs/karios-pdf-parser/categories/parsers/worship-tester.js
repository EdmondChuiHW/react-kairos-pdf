import {always, any, find, isNil, pipe, test, unless, when} from "ramda";
import {startsWithGpgOrFt, throwErrorWithMessage} from "../../utils";
import {worship} from "../category-types";

const makeWorship = (assignedGroup) => ({category: worship, assignedGroup});

export const worshipTester = any(test(/^worship/i));

export const worshipParser = pipe(
  unless(worshipTester, throwErrorWithMessage('Not worship strings')),
  find(startsWithGpgOrFt),
  when(isNil, always('')),
  makeWorship,
);
