import {
  addIndex,
  apply,
  compose,
  converge,
  filter,
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
} from "ramda";
import React from "react";
import {
  collectRowsUnderSessionIndex,
  excelLinefeed,
  formatAsShortName,
  formatSessionDateStr,
  formatStartEndTimeStr,
  mapRowToStringWithFallback,
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
import {CapitalizedHeader, Cell, replaceLineBreakWithBr, RowWithKey, TwoFragments} from "../../utils/ui-utils";

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
      TwoFragments(Session(s)),
      makeStartTimeAndCategories,
      collectRowsUnderSessionIndex(sI),
    )(rows)),
  )(sessions);
};

const sessionTimeLens = lensProp('date');
const sessionNumberLens = lensProp('sessionNumber');

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

const TimeDurationCell = pipe(formatStartEndTimeStr, Cell('duration'));

const findRowsWithCategory = c => filter(pathEq(['category', 'category'], c));

const extractShortNameFromRow = pipe(prop('facilitator'), formatAsShortName);

const mapWithShortName = row => pipe(
  mapRowToStringWithFallback,
  unless(isNilOrEmpty, pipe(
    s => `${s}${excelLinefeed}- ${extractShortNameFromRow(row)}`,
    replaceLineBreakWithBr,
  )),
)(row);

const Categories = rows => addIndex(map)((c, i) =>
  pipe(
    findRowsWithCategory(c),
    map(mapWithShortName),
    Cell(i),
  )(rows),
)(sortedCategories);

const makeStartTimeAndCategories = converge(
  TwoFragments, [
    pipe(juxt([head, last]), map(prop('startTime')), apply(TimeDurationCell)),
    Categories,
  ],
);
