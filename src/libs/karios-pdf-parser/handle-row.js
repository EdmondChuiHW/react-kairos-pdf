import {stringsToTimeTotal} from "./index";
import {ParsingErrors} from "./errors";
import {always, apply, converge, dec, identity, ifElse, juxt, last, length, lensIndex, pipe, slice, view} from "ramda";
import moment from "moment";
import {acceptedTimeFormats} from "./consts";

const makeRow = (startTime, declaredDuration, activityTexts, facilitator, errors) => ({
  startTime,
  declaredDuration,
  activityTexts,
  facilitator,
  errors,
});

const startTimeFromStr = s => moment(s, acceptedTimeFormats);
const isDurationsSame = (a, b) => a.asMilliseconds() === b.asMilliseconds();
const makeMismatchedDurationsError = (declared, total, activityTexts) => ParsingErrors.ofMismatchedDurations(`${declared.asMinutes()} | ${activityTexts}`, declared, total);

const getDeclaredDurationFromInt = i => moment.duration(i, 'minutes');
const getDeclaredDurationFromStr = pipe(Number.parseInt, getDeclaredDurationFromInt);

const getStartTime = pipe(
  view(lensIndex(0)),
  startTimeFromStr,
);

const getDeclaredDuration = pipe(
  view(lensIndex(1)),
  getDeclaredDurationFromStr,
);

const getActivityTextStrings = converge(
  slice, [
    always(2),
    pipe(length, dec),
    identity,
  ],
);
const getFacilitatorStr = last;

const getDeclaredAndActualTimesAndActivityText = juxt([
  getDeclaredDuration,
  pipe(getActivityTextStrings, stringsToTimeTotal),
  getActivityTextStrings,
]);

const getErrors = pipe(
  getDeclaredAndActualTimesAndActivityText,
  ifElse(
    apply(isDurationsSame),
    always([]),
    juxt([apply(makeMismatchedDurationsError)]),
  ),
);

// string[] => {startTime, declaredDuration, activityTexts, facilitator, errors}
export const handleRow = converge(
  makeRow, [
    getStartTime,
    getDeclaredDuration,
    getActivityTextStrings,
    getFacilitatorStr,
    getErrors,
  ],
);
