import {cond, equals, pipe, prop} from "ramda";

export const TableByCategories = ({rows, sessions}) => {

};

const catEq = pipe(prop('category'), equals);

const Cell = cond([
  [catEq('worship')],
]);
