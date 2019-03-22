import {
  always,
  compose,
  filter,
  flip,
  gt,
  ifElse,
  invoker,
  isEmpty,
  lensIndex,
  map,
  match,
  pipe,
  transduce,
  view,
} from "ramda";
import moment from "moment";

export function stringsToTimeTotal(strings) {
  const regexMatcher = match(/\(([0-9]+) mins?\)/);
  const regexFirstMatchLens = lensIndex(1);

  const strToMinuteNum = pipe(
    regexMatcher,
    ifElse(
      isEmpty,
      always('0'),
      view(regexFirstMatchLens),
    ),
    Number.parseInt,
  );

  const mapToDuration = i => moment.duration(i, 'minutes');
  const zeroDuration = mapToDuration(0);

  const accFn = invoker(1, 'add');  // moment.add(value)
  const filterFn = flip(gt)(0);  // or gt(__, 0)
  const transduceFn = compose(
    map(strToMinuteNum),
    filter(filterFn),
    map(mapToDuration),
  );

  return transduce(transduceFn, accFn, zeroDuration, strings);
}
