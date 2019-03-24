import {always, any, complement, findLast, match, pipe, reduce, test, unless, when} from "ramda";
import {isNilOrEmpty, stripAllQuotes, throwErrorWithMessage} from "../../utils";

const makeDevotion = (topic) => ({category: 'devotion', topic});

export const devotionTester = any(test(/(?:^devotion\s+.+)|(?:.+\s+devotion)$/i));
const devotionTopicMatcher = match(/(?:\(changed?\sto\)\s+)?(?:(?:devotion\s*-*\s*(.+))|(?:(?:\)\s+)?(.+)\s+devotion$))/i);

const topicReducer = (acc, curr) => pipe(
  devotionTopicMatcher,
  findLast(complement(isNilOrEmpty)),
  when(isNilOrEmpty, always(acc)),
)(curr);

export const devotionParser = pipe(
  unless(devotionTester, throwErrorWithMessage('Not devotion strings')),
  reduce(topicReducer, ''),
  stripAllQuotes,
  when(isNilOrEmpty, always('[Unknown topic]')),
  makeDevotion,
);
