import {always, any, complement, findLast, match, pipe, reduce, test, unless, when} from "ramda";
import {isNilOrEmpty, stripAllQuotes, throwErrorWithMessage} from "../../utils";

const makeVideo = (title) => ({category: 'video', title});

const removeTrailingParenthesisAndContents = s => s.replace(/\s*\(.*\)\s*$/, '');

export const videoTester = any(test(/^(?:\(changed?\sto\)\s+)?(?:video\s*-*\s*.*)/i));
const videoTitleMatcher = match(/^(?:\(changed?\sto\)\s+)?(?:video\s*-*\s*(.*))/i);

const titleReducer = (acc, curr) => pipe(
  videoTitleMatcher,
  findLast(complement(isNilOrEmpty)),
  when(isNilOrEmpty, always(acc)),
)(curr);

export const videoParser = pipe(
  unless(videoTester, throwErrorWithMessage('Not video strings')),
  reduce(titleReducer, ''),
  stripAllQuotes,
  removeTrailingParenthesisAndContents,
  when(isNilOrEmpty, always('[Unknown video]')),
  makeVideo,
);
