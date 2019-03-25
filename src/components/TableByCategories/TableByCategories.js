import {always, curry, map, pipe} from "ramda";
import {CapitalizedHeader} from "../../utils/ui-utils";
import React from "react";
import "./TableByCategories.css";
import {formatAsShortName} from "../../utils/utils";
import {
  chapterIntro,
  chapterReview,
  devotion,
  focusPrayer,
  video,
  worship,
} from "../../libs/karios-pdf-parser/categories/category-types";

const sortedCategories = [
  worship,
  devotion,
  focusPrayer,
  chapterReview,
  chapterIntro,
  video,
];

export const TableByCategories = ({rows, sessions, facilitators}) => {
  return pipe(
    always(<></>),
    makeTable(facilitators),
  )(rows);
};

const makeTable = curry((names, children) => <div className="table-by-categories">
    <table>
      <thead>
      <tr>
        {map(pipe(formatAsShortName, CapitalizedHeader))(names)}
      </tr>
      </thead>
      <tbody>
      {children}
      </tbody>
    </table>
  </div>,
);

// collectNames
