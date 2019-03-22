import {handleRow} from "../handle-row";
import moment from "moment";
import {acceptedTimeFormats} from "../consts";
import {curry, keys, lensPath, lensProp, view} from "ramda";
import {isLineYUnchanged} from "../is-line-y-unchanged";

export const isStrStartTime = str => str.length >= 4 && moment(str, acceptedTimeFormats, true).isValid();

const pushIndexToAllExistingFacilitators = (facilitatorToRows, index) => {
  keys(facilitatorToRows).forEach(name => {
    facilitatorToRows[name].push(index);
  });
};

const getItems = view(lensProp('items'));

const getItemStr = view(lensProp('str'));
const getItemY = view(lensPath(['transform', 5]));

function oldHandlePage(handleSession, textContent) {
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
      const isLineUnchanged = isLineYUnchanged(lastRowPositionY, currentRowPositionY);
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

const makePage = ({sessions, facilitatorToRows, discarded}) => ({
  sessions,
  facilitatorToRows,
  discarded,
});

const handlePage = (handleSession, textContent) => {
  return {
    sessions,
    facilitatorToRows,
    discarded,
  };
};

export const makeHandlePage = curry(handlePage);
