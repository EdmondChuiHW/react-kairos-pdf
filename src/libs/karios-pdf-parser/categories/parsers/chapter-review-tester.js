import {always, any, apply, ifElse, juxt, lensIndex, match, pipe, reduce, test, trim, unless, view, when} from "ramda";
import {isNilOrEmpty, stripAllQuotes, throwErrorWithMessage} from "../../utils";

const makeChapter = (number, topic) => ({category: 'chapter-review', number, topic});

export const chapterReviewTester = any(test(/^chapter\s*\d*.+\s*review$/i));
const chapterReviewMatcher = match(/^chapter\s*(\d*)\s*(.+)\s*review$/i);

const chapterIndexLens = lensIndex(1);
const chapterTopicLens = lensIndex(2);
const unknownTopicStr = '[Unknown topic]';

const chapterIndexAndTopicReducer = (acc, curr) => pipe(
  chapterReviewMatcher,
  ifElse(
    isNilOrEmpty,
    always(acc),
    juxt([
      pipe(view(chapterIndexLens), when(isNilOrEmpty, always('-1')), Number.parseInt),
      pipe(
        view(chapterTopicLens),
        when(isNilOrEmpty, ''),
        stripAllQuotes,
        trim,
        when(isNilOrEmpty, always(unknownTopicStr)),
      ),
    ]),
  ),
)(curr);

export const chapterReviewParser = pipe(
  unless(chapterReviewTester, throwErrorWithMessage('Not chapter review strings')),
  reduce(chapterIndexAndTopicReducer, []),
  when(isNilOrEmpty, always([-1, unknownTopicStr])),
  apply(makeChapter),
);
