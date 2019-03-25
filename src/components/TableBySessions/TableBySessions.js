import {
  addIndex,
  apply,
  compose,
  converge,
  curry,
  find,
  head,
  juxt,
  last,
  lensProp,
  map,
  pathEq,
  pipe,
  prop,
  unless,
  view,
  when,
} from "ramda";
import React from "react";
import {
  collectRowsUnderSessionIndex,
  fallbackTextForRow,
  formatAsShortName,
  formatSessionDateStr,
  formatStartEndTimeStr,
  viewTextFromCategory,
} from "../../utils/utils";
import './TableBySessions.css';
import {
  chapterIntro,
  chapterReview,
  devotion,
  focusPrayer,
  video,
  worship,
} from "../../libs/karios-pdf-parser/categories/category-types";
import {isNilOrEmpty} from "../../libs/karios-pdf-parser/utils";
import {CapitalizedHeader, RowWithKey} from "../../utils/ui-utils";

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
      RowWithKey(sI),
      Fragment(Session(s)),
      makeStartTimeAndCategories,
      collectRowsUnderSessionIndex(sI),
    )(rows)),
  )(sessions);
};

const sessionTimeLens = lensProp('date');
const sessionNumberLens = lensProp('sessionNumber');

const Fragment = curry((a, b) => <>{a}{b}</>);

const Table = children => <div className="table-by-sessions">
  <table>
    <thead>
    <tr>
      <th>Session</th>
      <th>Date</th>
      <th>Time</th>
      {map(CapitalizedHeader)(sortedCategories)}
    </tr>
    </thead>
    <tbody>
    {children}
    </tbody>
  </table>
</div>;

const Session = (session) => <>
  <td>{view(sessionNumberLens, session)}</td>
  <td>{pipe(view(sessionTimeLens), formatSessionDateStr)(session)}</td>
</>;

const Cell = curry((key, text) => <td key={key}>{text}</td>);
const TimeDurationCell = pipe(formatStartEndTimeStr, Cell('duration'));

const findRowWithCategory = c => find(pathEq(['category', 'category'], c));

const extractShortNameFromRow = pipe(prop('facilitator'), formatAsShortName);

const mapRowToString = fallBackTextFn => row => unless(isNilOrEmpty, pipe(
  prop('category'),
  viewTextFromCategory,
  when(isNilOrEmpty, () => fallBackTextFn(row)),
  unless(isNilOrEmpty, s => `${s}\n• ${extractShortNameFromRow(row)}`),
))(row);

const Categories = rows => addIndex(map)((c, i) =>
  pipe(
    findRowWithCategory(c),
    mapRowToString(unless(isNilOrEmpty, fallbackTextForRow)),
    Cell(i),
  )(rows),
)(sortedCategories);

const makeStartTimeAndCategories = converge(
  Fragment, [
    pipe(juxt([head, last]), map(prop('startTime')), apply(TimeDurationCell)),
    Categories,
  ],
);
