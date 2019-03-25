import {addIndex, curry, is, map, pipe, split, when} from "ramda";
import React, {Fragment} from "react";
import {capitalize, lowerCase} from "lodash-es";
import {excelLinefeed} from "./utils";

export const RowWithKey = curry((key, children) => <tr key={key}>{children}</tr>);

export const Header = h => <th key={h}>{h}</th>;
export const CapitalizedHeader = pipe(
  lowerCase,
  capitalize,
  Header,
);

export const TwoFragments = curry((a, b) => <>{a}{b}</>);
export const Cell = curry((key, text) => <td key={key} className="tableexport-string">{text}</td>);

const mapWithBr = addIndex(map)((item, key) => <Fragment key={key}>{item + excelLinefeed}<br/></Fragment>);
export const replaceLineBreakWithBr = when(is(String), pipe(
  split(excelLinefeed),
  mapWithBr,
));
