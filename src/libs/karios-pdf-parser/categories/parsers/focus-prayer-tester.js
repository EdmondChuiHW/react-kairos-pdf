import {always, any, complement, converge, find, findLast, match, pipe, reduce, test, unless, when} from "ramda";
import {isNilOrEmpty, startsWithGpgOrFt, throwErrorWithMessage} from "../../utils";
import {focusPrayer} from "../category-types";

const makeFocusPrayer = (assignedGroup, prayerTarget) => ({category: focusPrayer, assignedGroup, prayerTarget});

export const focusPrayerTester = any(test(/^lrp prayer\s+focus/i));
const focusPrayerMatcher = match(/^lrp prayer\s+focus\s+-+\s+(.*)/i);

const prayerTargetReducer = (acc, curr) => pipe(
  focusPrayerMatcher,
  findLast(complement(isNilOrEmpty)),
  when(isNilOrEmpty, always(acc)),
)(curr);

export const focusPrayerParser = pipe(
  unless(focusPrayerTester, throwErrorWithMessage('Not focus prayer strings')),
  converge(
    makeFocusPrayer, [
      pipe(find(startsWithGpgOrFt), when(isNilOrEmpty, always(''))),
      pipe(
        reduce(prayerTargetReducer, ''),
        when(isNilOrEmpty, always('[Unknown prayer target]')),
      ),
    ],
  ),
);
