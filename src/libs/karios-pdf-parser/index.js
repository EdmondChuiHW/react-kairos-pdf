import pdf from "./pdf-parse";

import moment from "moment";
import {from} from "rxjs";
import {keys} from "lodash-es";
import {ParsingErrors} from "./errors";
import {
  always,
  compose,
  curry,
  filter,
  flip,
  gt,
  ifElse,
  invoker,
  isEmpty,
  last,
  lensIndex,
  map,
  match,
  pipe,
  transduce,
  view,
} from "ramda";

export const isStrStartTime = str => str.length >= 4 && moment(str, ['h:mm', 'hh:mm'], true).isValid();

// return str.length >= 4 && moment(str, ['H:mm', 'HH:mm'], true).isValid();

export function handlePage(textContent) {
  let session = null;

  const rows = [];
  let pendingRowInput = [];

  const discarded = {
    page: [],
    session: [],
    rows: [],
  };
  const errors = {
    page: [],
    session: [],
    rows: [],
  };
  const facilitatorToRows = {};
  const allFacilitatorsRows = [];


  const pushIndexToAllExistingFacilitators = (index) => {
    keys(facilitatorToRows).forEach(name => {
      facilitatorToRows[name].push(index);
    });
  };

  let lastRowPositionY = null;

  let allTextsIndex = 0;
  let currentRowIndex = -1;
  while (allTextsIndex < textContent.items.length) {
    const item = textContent.items[allTextsIndex];
    if (!session && item.str.startsWith('Session ')) {
      const s = handleSession(item.str);
      session = s.result;
      discarded.session = s.meta.session;
      errors.session = s.meta.errors;

    } else {
      const currentRowPositionY = item.transform[5];
      if (isStrStartTime(item.str)) {
        if (pendingRowInput && pendingRowInput.length) {
          const r = handleRow(pendingRowInput);
          rows[currentRowIndex] = r.result;
          if (r.result.facilitator && r.result.facilitator.toLocaleLowerCase() === 'all') {
            allFacilitatorsRows.push(currentRowIndex);
            pushIndexToAllExistingFacilitators(currentRowIndex);
          } else {
            if (!facilitatorToRows[r.result.facilitator]) {
              facilitatorToRows[r.result.facilitator] = allFacilitatorsRows.slice();
            }
            facilitatorToRows[r.result.facilitator].push(currentRowIndex);
          }
          if (r.meta.discarded && r.meta.discarded.length) {
            discarded.rows[currentRowIndex] = r.meta.discarded;
          }
          if (r.meta.errors && r.meta.errors.length) {
            errors.rows[currentRowIndex] = r.meta.errors;
          }
        }
        lastRowPositionY = currentRowPositionY;
        pendingRowInput = [];
        currentRowIndex += 1;
      }
      const isLineUnchanged = lastRowPositionY === currentRowPositionY || lastRowPositionY == null;
      if (isLineUnchanged) {
        if (currentRowIndex >= 0) {
          pendingRowInput.push(item.str);
        } else {
          discarded.page.push(item.str);
        }
      } else {
        if (currentRowIndex < 0) {
          discarded.page.push(item.str);
        } else {
          pendingRowInput.push(item.str);
        }
      }
    }

    allTextsIndex += 1;
  }
  return {
    session,
    rows,
    facilitatorToRows,
    errors,
    discarded,
  };
}

export function handleSession(sessionStr) {
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
    errors,
  };
}

export function tallyActivityTimes(activityTimes) {
  return activityTimes.reduce((memo, minStr) => {
    return memo.add(moment.duration(Number.parseInt(minStr), 'minutes'));
  }, moment.duration(0, 'minutes'))
}

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

export function handleRow(strings) {
  const makeRow = curry((startTime, declaredDuration, activityTexts, facilitator, errors) => ({
    startTime,
    declaredDuration,
    activityTexts,
    facilitator,
    errors,
  }));

  pipe(

  );

  const startTimeFromStr = s => moment(s, ['h:mm', 'hh:mm']);
  const declaredDurationFromInt = i => moment.duration(i, 'minutes');
  const declaredDurationFromStr = pipe(Number.parseInt, declaredDurationFromInt);
  const getFacilitatorStr = last;

  makeRow(startTimeFromStr(strings[0]))(declaredDurationFromStr(strings[1]));

  const startTime = moment(strings[0], ['h:mm', 'hh:mm']);
  const declaredDuration = moment.duration(Number.parseInt(strings[1]), 'minutes');

  const errors = [];
  const activityTexts = [];
  const activityTimes = [];

  // user stringsToTimeTotal(…)
  for (let i = 2; i < strings.length - 1; i += 1) {
    const activityText = strings[i];
    const activityTime = activityText.match(/\(([0-9]+) min\)/);

    activityTexts.push(activityText);
    if (activityTime && activityTime.length) {
      activityTimes.push(activityTime[1]);
    }
  }

  if (activityTimes && activityTimes.length) {
    const total = tallyActivityTimes(activityTimes);

    if (total.asMilliseconds() !== declaredDuration.asMilliseconds()) {
      errors.push(
        ParsingErrors.ofMismatchedDurations(`${declaredDuration.asMinutes()} | ${activityTexts}`, declaredDuration, total),
      );
    }
  }
  const facilitator = last(strings);

  return {
    startTime,
    declaredDuration,
    activityTexts,
    facilitator,
    errors,
  };
}

export function readBufferToPages(buffer) {
  function renderPage(pageData) {
    const renderOptions = {
      normalizeWhitespace: true,
      disableCombineTextItems: true,
    };

    return pageData
      .getTextContent(renderOptions)
      .then(handlePage);
  }

  const options = {
    pagerender: renderPage,
  };

  return from(pdf(buffer, options));
}
