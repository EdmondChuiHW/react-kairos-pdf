import moment from "moment";
import {ParsingErrors} from "../errors";
import {curry} from "ramda";

export const handleSession = curry((sessionStr, rows) => {
  const sessionRegExp = /Session ([0-9]+)/;
  const dateRegExp = /- (.*)/;
  const sessionMatch = sessionStr.match(sessionRegExp);
  const dateMatch = sessionStr.match(dateRegExp);

  const date = moment(dateMatch && dateMatch[1], 'dddd, DD MMMM, YYYY');
  const errors = (!sessionMatch || !date.isValid())
    ? [ParsingErrors.ofInvalidSession(sessionStr)]
    : [];
  return {
    sessionNumber: Number.parseInt(sessionMatch && sessionMatch[1]),
    date: date,
    rows,
    errors,
  };
});
