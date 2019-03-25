import {apply, curry, flip, identity, ifElse, juxt, map, pipe, prepend, prop, sortBy} from "ramda";
import {CapitalizedHeader, RowWithKey} from "../../utils/ui-utils";
import React, {useMemo} from "react";
import "./TableByCategories.css";
import {
  formatAsShortName,
  mapRowsToIndexByCategoryThenName,
  mapRowToStringWithFallback,
  viewByIndex,
} from "../../utils/utils";
import {
  chapterIntro,
  chapterReview,
  devotion,
  focusPrayer,
  video,
  worship,
} from "../../libs/karios-pdf-parser/categories/category-types";
import {isNilOrEmpty} from "../../libs/karios-pdf-parser/utils";

const sortedCategories = [
  worship,
  devotion,
  focusPrayer,
  chapterReview,
  chapterIntro,
  video,
];

export const TableByCategories = ({rows, sessions, facilitators}) => {
  const catToNameToRowIndex = useMemo(() => mapRowsToIndexByCategoryThenName(rows), [rows]);
  const names = useMemo(() => sortBy(identity, facilitators), [facilitators]);
  console.log(catToNameToRowIndex);
  return pipe(
    makeRows(sortedCategories, names, rows),
    makeTable(names),
  )(catToNameToRowIndex);
};

const makeTable = curry((names, children) =>
  <div className="table-by-categories">
    <table>
      <thead>
      <tr>
        <th/>
        {map(pipe(formatAsShortName, CapitalizedHeader))(names)}
      </tr>
      </thead>
      <tbody>
      {children}
      </tbody>
    </table>
  </div>,
);

// catType => [{'Sam': rowIndex[], 'Laura': rowIndex[], …}, catType]
const viewNameIndexFromCatType = flip(juxt([prop, identity]));

// {'Sam': rowIndex[], 'Laura': rowIndex[], …} => name => rowIndex[]
const viewRowIndexArrayFromName = flip(prop);

// {'Sam': rowIndex[], 'Laura': rowIndex[], …} => cell[]
const mapToCellsByCatType = curry((names, rows, namesToRowIndex, catType) => {
  return pipe(
    map(pipe(
      viewRowIndexArrayFromName(namesToRowIndex),
      ifElse(
        isNilOrEmpty,
        renderCell,
        pipe(
          map(viewByIndex(rows)),
          renderCell,
        ),
      ),
    )),
    prepend(CapitalizedHeader(catType)),
    RowWithKey(catType),
  )(names);
});

const renderCell = rows => <td>
  {rows && rows.map(renderRow)}
</td>;

const renderRow = pipe(
  mapRowToStringWithFallback,
  c => <div>{c}</div>,
);

const makeRows = curry((catTypes, names, rows, catToNameToRowIndex) => {
  return map(pipe(
    viewNameIndexFromCatType(catToNameToRowIndex),
    apply(mapToCellsByCatType(names, rows)),
  ))(catTypes);
});
