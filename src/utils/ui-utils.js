import {curry, pipe} from "ramda";
import React from "react";
import {capitalize, lowerCase} from "lodash-es";

export const RowWithKey = curry((key, children) => <tr key={key}>{children}</tr>);

export const Header = h => <th key={h}>{h}</th>;
export const CapitalizedHeader = pipe(
  lowerCase,
  capitalize,
  Header,
);
