import {
  always,
  any,
  apply,
  either,
  ifElse,
  juxt,
  lensIndex,
  match,
  pipe,
  reduce,
  test,
  trim,
  unless,
  view,
  when,
} from "ramda";
import {isNilOrEmpty, stripAllQuotes} from "../../utils";

const throwError = msg => () => {
  throw new Error(msg);
};

const makeChapter = (index, topic) => ({category: 'chapter-intro', index, topic});

export const chapterIntroTester = any(test(/(?:^chapter\s*\d*\s*.+\s*introduction$)|(?:^introduction\s*to\s*chapter\s*\d*\s*.*\s*)/i));
const chapterIntroMatcher = match(/(?:^chapter\s*(\d*)\s*(.+)\s*introduction$)|(?:^introduction\s*to\s*chapter\s*(\d*)\s*(.*)\s*)/i);

export const viewChapterIndex = either(view(lensIndex(1)), view(lensIndex(3)));
export const viewChapterTopic = either(view(lensIndex(2)), view(lensIndex(4)));
const unknownTopicStr = '[Unknown topic]';

const chapterIndexAndTopicReducer = (acc, curr) => pipe(
  chapterIntroMatcher,
  ifElse(
    isNilOrEmpty,
    always(acc),
    juxt([
      pipe(viewChapterIndex, when(isNilOrEmpty, always('-1')), Number.parseInt),
      pipe(
        viewChapterTopic,
        when(isNilOrEmpty, always('')),
        stripAllQuotes,
        trim,
        when(isNilOrEmpty, always(unknownTopicStr)),
      ),
    ]),
  ),
)(curr);

export const chapterIntroParser = pipe(
  unless(chapterIntroTester, throwError('Not chapter intro strings')),
  reduce(chapterIndexAndTopicReducer, []),
  when(isNilOrEmpty, always([-1, unknownTopicStr])),
  apply(makeChapter),
);
