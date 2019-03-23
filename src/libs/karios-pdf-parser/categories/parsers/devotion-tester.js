import {always, any, complement, findLast, match, pipe, reduce, test, unless, when} from "ramda";
import {isNilOrEmpty} from "../../utils";

const throwError = msg => () => {
  throw new Error(msg);
};

const normalize = s => s.replace(/[\s'"]+/g, '');
const makeDevotion = (topic) => ({category: 'devotion', topic});

export const devotionTester = any(test(/(?:^devotion\s+.+)|(?:.+\s+devotion)$/i));
const devotionTopicMatcher = match(/(?:\(changed?\sto\)\s+)?(?:(?:devotion\s+(.+))|(?:(?:\)\s+)?(.+)\s+devotion$))/i);

const topicReducer = (acc, curr) => pipe(
  devotionTopicMatcher,
  findLast(complement(isNilOrEmpty)),
  when(isNilOrEmpty, always(acc)),
)(curr);

export const devotionParser = pipe(
  unless(devotionTester, throwError('Not devotion strings')),
  reduce(topicReducer, ''),
  normalize,
  when(isNilOrEmpty, always('[Unknown topic]')),
  makeDevotion,
);
