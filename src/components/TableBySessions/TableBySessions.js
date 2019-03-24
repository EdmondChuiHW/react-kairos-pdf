import {
  addIndex,
  compose,
  curry,
  filter,
  find,
  identity,
  join,
  lensProp,
  map,
  pathEq,
  pipe,
  prop,
  propEq,
  sortBy,
  unless,
  view,
  when,
} from "ramda";
import React from "react";
import {viewTextFromCategory} from "../../utils/utils";
import './TableBySessions.css';
import {knownCategoryTypes} from "../../libs/karios-pdf-parser/categories/category-types";
import {capitalize, lowerCase} from "lodash-es";
import {isNilOrEmpty} from "../../libs/karios-pdf-parser/utils";

const sortedCategories = sortBy(identity)(knownCategoryTypes);

export const TableBySessions = ({sessions, rows}) => {
  return compose(
    Table,
    addIndex(map)((s, sI) => compose(
      Row(sI),
      Fragment(Session(s)),
      Categories,
      rowsUnderSessionIndex(sI),
    )(rows)),
  )(sessions);
};

const sessionTimeLens = lensProp('date');
const sessionNumberLens = lensProp('sessionNumber');

const formatDateTimeStr = sessionTime => sessionTime.format('ddd ll');

const rowsUnderSessionIndex = sI => filter(propEq('sessionIndex', sI));

const Fragment = curry((f, s) => <>{f}{s}</>);

const Table = children => <div className="table-by-sessions">
  <table>
    <thead>
    <tr>
      <th>Session</th>
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
  <td>{pipe(view(sessionTimeLens), formatDateTimeStr)(session)}</td>
</>;

const Cell = curry((key, text) => <td key={key}>{text}</td>);

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
