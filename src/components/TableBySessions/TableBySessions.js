import {
  addIndex,
  always,
  compose,
  curry,
  filter,
  find,
  identity,
  ifElse,
  isNil,
  lensProp,
  map,
  pathEq,
  pipe,
  prop,
  propEq,
  sortBy,
  view,
} from "ramda";
import React from "react";
import {viewTextFromCategory} from "../../utils/utils";
import './TableBySessions.css';
import {knownCategoryTypes, other} from "../../libs/karios-pdf-parser/categories/category-types";
import {capitalize, lowerCase} from "lodash-es";

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

const Category = curry((keyPrefix, cat) => <td key={keyPrefix + cat.category}>{viewTextFromCategory(cat)}</td>);

const findCategory = c => find(pathEq(['category', 'category'], c));

const Categories = rows => addIndex(map)((c, i) => pipe(
  findCategory(c),
  ifElse(
    isNil,
    always({category: other}),
    prop('category'),
  ),
  Category(i),
)(rows), sortedCategories);

const CategoryHeaders = map(pipe(
  lowerCase,
  capitalize,
  Header,
));
