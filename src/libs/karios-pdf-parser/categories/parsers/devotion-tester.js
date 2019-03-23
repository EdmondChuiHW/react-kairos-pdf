import {
  always,
  any,
  complement,
  either,
  findLast,
  isEmpty,
  isNil,
  match,
  pipe,
  reduce,
  test,
  unless,
  when,
} from "ramda";

const isNilOrEmpty = either(isNil, isEmpty);

const throwError = msg => () => {
  throw new Error(msg);
};

const normalize = s => s.replace(/[\s'"]+/g, '');
const makeDevotion = (topic) => ({category: 'devotion', topic});

export const devotionTester = any(test(/(?:devotion\s+.+)|(?:.+\s+devotion)$/i));
const devotionTopicMatcher = match(/(?:\(changed?\sto\)\s?)?(?:(?:devotion\s+(.+))|(?:(?:\)\s)?(.+)\s+devotion$))/i);

const reducer = (acc, curr) => pipe(
  devotionTopicMatcher,
  findLast(complement(isNilOrEmpty)),
  when(isNilOrEmpty, always(acc)),
)(curr);

export const devotionParser = pipe(
  unless(devotionTester, throwError('Not devotion strings')),
  reduce(reducer, ''),
  when(isNilOrEmpty, always('[Unknown topic]')),
  normalize,
  makeDevotion,
);
