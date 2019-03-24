import {
  addIndex,
  apply,
  compose,
  converge,
  curry,
  filter,
  find,
  head,
  join,
  juxt,
  last,
  lensProp,
  map,
  pathEq,
  pipe,
  prop,
  propEq,
  unless,
  view,
  when,
} from "ramda";
import React from "react";
import {formatSessionDateStr, formatStartEndTimeStr, viewTextFromCategory} from "../../utils/utils";
import './TableBySessions.css';
import {
  chapterIntro,
  chapterReview,
  devotion,
  focusPrayer,
  video,
  worship,
} from "../../libs/karios-pdf-parser/categories/category-types";
import {capitalize, lowerCase} from "lodash-es";
import {isNilOrEmpty} from "../../libs/karios-pdf-parser/utils";

const sortedCategories = [
  worship,
  devotion,
  focusPrayer,
  chapterReview,
  chapterIntro,
  video,
];

export const TableBySessions = ({sessions, rows}) => {
  return compose(
    Table,
    addIndex(map)((s, sI) => compose(
      Row(sI),
      Fragment(Session(s)),
      makeStartTimeAndCategories,
      rowsUnderSessionIndex(sI),
    )(rows)),
  )(sessions);
};

const sessionTimeLens = lensProp('date');
const sessionNumberLens = lensProp('sessionNumber');

const rowsUnderSessionIndex = sI => filter(propEq('sessionIndex', sI));

const Fragment = curry((a, b) => <>{a}{b}</>);

const Table = children => <div className="table-by-sessions">
  <table>
    <thead>
    <tr>
      <th>Session</th>
      <th>Date</th>
      <th>Time</th>
      {CategoryHeaders(sortedCategories)}
    </tr>
    </thead>
    <tbody>
    {children}
    </tbody>
  </table>
</div>;

const Row = curry((key, children) => <tr key={key}>{children}</tr>);
const Header = h => <th key={h}>{h}</th>;


const Session = (session) => <>
  <td>{view(sessionNumberLens, session)}</td>
  <td>{pipe(view(sessionTimeLens), formatSessionDateStr)(session)}</td>
</>;

const Cell = curry((key, text) => <td key={key}>{text}</td>);
const TimeDurationCell = pipe(formatStartEndTimeStr, Cell('duration'));

const findRowWithCategory = c => find(pathEq(['category', 'category'], c));

const mapRowToString = fallBackTextFn => row => unless(isNilOrEmpty, pipe(
  prop('category'),
  viewTextFromCategory,
  when(isNilOrEmpty, () => fallBackTextFn(row)),
))(row);

const Categories = rows => addIndex(map)((c, i) =>
  pipe(
    findRowWithCategory(c),
    mapRowToString(unless(isNilOrEmpty, pipe(prop('activityTexts'), join('\n')))),
    Cell(i),
  )(rows),
)(sortedCategories);

const CategoryHeaders = map(pipe(
  lowerCase,
  capitalize,
  Header,
));

const makeStartTimeAndCategories = converge(
  Fragment, [
    pipe(juxt([head, last]), map(prop('startTime')), apply(TimeDurationCell)),
    Categories,
  ],
);
