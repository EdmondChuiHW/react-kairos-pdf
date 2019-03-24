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
import {isNilOrEmpty, stripAllQuotes, throwErrorWithMessage} from "../../utils";

const makeChapter = (number, topic) => ({category: 'chapter-intro', number, topic});

export const chapterIntroTester = any(test(/(?:^chapter\s*\d*\s*.+\s*introduction$)|(?:^introduction\s*to\s*chapter\s*\d*\s*.*\s*)/i));
const chapterIntroMatcher = match(/(?:^chapter\s*(\d*)\s*(.+)\s*introduction$)|(?:^introduction\s*to\s*chapter\s*(\d*)\s*(.*)\s*)/i);

export const viewChapterNumber = either(view(lensIndex(1)), view(lensIndex(3)));
export const viewChapterTopic = either(view(lensIndex(2)), view(lensIndex(4)));
const unknownTopicStr = '[Unknown topic]';

const chapterIndexAndTopicReducer = (acc, curr) => pipe(
  chapterIntroMatcher,
  ifElse(
    isNilOrEmpty,
    always(acc),
    juxt([
      pipe(viewChapterNumber, when(isNilOrEmpty, always('-1')), Number.parseInt),
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
  unless(chapterIntroTester, throwErrorWithMessage('Not chapter intro strings')),
  reduce(chapterIndexAndTopicReducer, []),
  when(isNilOrEmpty, always([-1, unknownTopicStr])),
  apply(makeChapter),
);
