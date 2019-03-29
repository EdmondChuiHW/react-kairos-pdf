import {addIndex, always, apply, curry, flip, identity, ifElse, juxt, map, pipe, prepend, prop, sortBy} from "ramda";
import {CapitalizedHeader, Cell, Header, RowWithKey} from "../../utils/ui-utils";
import React, {useMemo} from "react";
import "./TableByCategories.css";
import {
  excelLinefeed,
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
  meeting,
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
  meeting,
];

export const TableByCategories = ({rows, sessions, facilitators}) => {
  const catToNameToRowIndex = useMemo(() => mapRowsToIndexByCategoryThenName(rows), [rows]);
  const names = useMemo(() => sortBy(identity, facilitators), [facilitators]);
  return pipe(
    makeRows(sortedCategories, names, rows),
    makeTable(names),
  )(catToNameToRowIndex);
};

const makeTable = curry((names, children) =>
  <div className="table-by-categories phantom">
    <table id="schedule-by-facilitator">
      <thead>
      <tr>
        <th/>
        {map(pipe(formatAsShortName, Header))(names)}
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
    addIndex(map)((c, i) => pipe(
      viewRowIndexArrayFromName(namesToRowIndex),
      ifElse(
        isNilOrEmpty,
        renderCell(i),
        pipe(
          map(viewByIndex(rows)),
          renderCell(i),
        ),
      ),
    )(c)),
    prepend(CapitalizedHeader(catType)),
    RowWithKey(catType),
  )(names);
});

const renderCell = index => {
  return ifElse(
    isNilOrEmpty,
    always(Cell(index, '')),
    pipe(
      addIndex(map)((c, i) => renderRow(`${index} ${i}`)(c)),
      Cell(index),
    ),
  );
};

const renderRow = key => pipe(
  mapRowToStringWithFallback,
  c => <span key={key}>{c + excelLinefeed}<br/></span>,
);

const makeRows = curry((catTypes, names, rows, catToNameToRowIndex) => {
  return map(pipe(
    viewNameIndexFromCatType(catToNameToRowIndex),
    apply(mapToCellsByCatType(names, rows)),
  ))(catTypes);
});