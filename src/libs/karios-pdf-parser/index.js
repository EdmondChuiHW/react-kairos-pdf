import pdf from "./pdf-parse";

import moment from "moment";
import {from} from "rxjs";
import {ParsingErrors} from "./errors";

function makeItem(result, errors, discarded) {
  return {
    result: result,
    meta: {
      discarded: discarded || [],
      errors: errors || [],
    },
  };
}

function isStrStartTime(str) {
  return str.length >= 4 && moment(str, ['h:mm', 'hh:mm'], true).isValid();
}

function handlePage(textContent) {
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
  return makeItem({
      session,
      rows,
    },
    errors,
    discarded
  );
}

function handleSession(sessionStr) {
  const regExp = /Session ([0-9]+) - (.*)/;
  const match = sessionStr.match(regExp);
  if (!match.length) {
    return makeItem(null, [
      ParsingErrors.ofInvalidSession(sessionStr),
    ]);
  }
  return makeItem({
    sessionNumber: Number.parseInt(match[1]),
    date: moment(match[2], 'dddd, DD MMMM, YYYY'),
  });
}

function tallyActivityTimes(activityTimes) {
  return activityTimes.reduce((memo, minStr) => {
    return memo.add(moment.duration(Number.parseInt(minStr), 'minutes'));
  }, moment.duration(0, 'minutes'))
}

function handleRow(strings) {
  const startTime = moment(strings[0], ['h:mm', 'hh:mm'], true);
  const declaredDuration = moment.duration(Number.parseInt(strings[1]), 'minutes');

  const errors = [];
  const activityTexts = [];
  const activityTimes = [];

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
        ParsingErrors.ofMismatchedDurations(`${declaredDuration} | ${activityTexts}`, declaredDuration, total),
      );
    }
  }
  const facilitator = strings[strings.length - 1];

  return makeItem({
    startTime,
    declaredDuration,
    activityTexts,
    facilitator,
  }, errors);
}

export function readBufferToPages(buffer) {
  function renderPage(pageData) {
    const renderOptions = {
      normalizeWhitespace: true,
      disableCombineTextItems: true
    };

    return pageData
      .getTextContent(renderOptions)
      .then(handlePage);
  }

  const options = {
    pagerender: renderPage
  };

  return from(pdf(buffer, options));
}