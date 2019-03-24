import {handleRow} from "../handle-row";
import moment from "moment";
import {acceptedTimeFormats} from "../consts";
import {
  always,
  append,
  assoc,
  compose,
  cond,
  converge,
  curry,
  dissoc,
  equals,
  flip,
  isEmpty,
  keys,
  last,
  length,
  lensPath,
  lensProp,
  over,
  pipe,
  prop,
  set,
  startsWith,
  T,
  transduce,
  unless,
  view,
} from "ramda";
import {isLineYUnchanged} from "../is-line-y-unchanged";
import {handleSession} from "../handle-session";
import {throwErrorWithMessage} from "../utils";

export const isStrStartTime = str => str.length >= 4 && moment(str, acceptedTimeFormats, true).isValid();

const pushIndexToAllExistingFacilitators = (facilitatorToRows, index) => {
  keys(facilitatorToRows).forEach(name => {
    facilitatorToRows[name].push(index);
  });
};

export const oldHandlePage = curry((handleSession, textContent) => {
  const sessions = [];

  const rows = [];
  let pendingRowInput = [];

  const discarded = [];
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
    if (item.str.startsWith('Session ')) {
      const s = handleSession(item.str);
      sessions.push(s);

    } else {
      const currentRowPositionY = item.transform[5];
      if (isStrStartTime(item.str)) {
        if (pendingRowInput && pendingRowInput.length) {
          const r = handleRow(pendingRowInput);
          r.sessionIndex = last(sessions).sessionNumber - 1;
          rows[currentRowIndex] = r;
          if (r.facilitator && r.facilitator.toLocaleLowerCase() === 'all') {
            allFacilitatorsRows.push(currentRowIndex);
            pushIndexToAllExistingFacilitators(currentRowIndex);
          } else {
            if (!facilitatorToRows[r.facilitator]) {
              facilitatorToRows[r.facilitator] = allFacilitatorsRows.slice();
            }
            facilitatorToRows[r.facilitator].push(currentRowIndex);
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
          discarded.push(item.str);
        }
      } else {
        if (currentRowIndex < 0) {
          discarded.push(item.str);
        } else {
          pendingRowInput.push(item.str);
        }
      }
    }

    allTextsIndex += 1;
  }
  return {
    sessions,
    rows,
    facilitatorToRows,
    discarded,
  };
});

const makePage = ({sessions, rows, facilitatorToRows, discarded}) => ({
  sessions,
  rows,
  facilitatorToRows,
  discarded,
});

const viewItems = prop('items');

const viewItemStr = prop('str');
const viewItemY = view(lensPath(['transform', 5]));

const isStrSession = startsWith('Session ');

const sessionType = 'session';
const pendingCellType = 'cell';
const cellFlushMarkerType = 'cell:flush-marker';
const discardType = 'discard';

const assocType = assoc('type');
const dissocType = dissoc('type');
const viewType = prop('type');

const assocSessionIndex = assoc('sessionIndex');
const assocRawStr = assoc('rawStr');

const makeDiscard = assoc('type', discardType);

const makeResult = () => ({sessions: [], rows: [], pendingCells: [], lastY: -1});
const sessionsLens = lensProp('sessions');
const rowsLens = lensProp('rows');
const pendingCellsLens = lensProp('pendingCells');
const lastYLens = lensProp('lastY');
const viewCurrentSessionsIndex = pipe(view(sessionsLens), length);

const appendWithLens = flip(over(flip(append)));
const appendToSessions = appendWithLens(sessionsLens);
const appendToRows = appendWithLens(rowsLens);
const appendToPendingCells = appendWithLens(pendingCellsLens);

const makeCellFlushMarker = pipe(assocRawStr, assocType(cellFlushMarkerType));

const xForm = compose(
  cond([
    [pipe(viewItemStr, isStrSession), pipe(viewItemStr, handleSession, assocType(sessionType))],
    [pipe(viewItemStr, isStrStartTime), makeCellFlushMarker],
    [T, makeDiscard],
  ]),
);

const ifTypeEquals = pipe(viewType, equals);
const updateLastY = set(lastYLens);

const flushPendingCellsIntoRowIfNotEmpty =
  unless(
    pipe(view(pendingCellsLens), isEmpty),
    over(
      pendingCellsLens,
      pipe(over(rowsLens, handleRow), always([])),
    ),
  );

const accFlushCell = acc => pipe(
  flushPendingCellsIntoRowIfNotEmpty(),
);

const accRow = acc => pipe(
  dissocType,
  converge(assocSessionIndex, [viewCurrentSessionsIndex]),
  converge(updateLastY, [viewItemY]),
  appendToRows(acc),
);

const accFn = (acc, cur) => pipe(
  cond([
    [ifTypeEquals(sessionType), pipe(dissocType, appendToSessions(acc))],
    [ifTypeEquals(cellFlushMarkerType), accFlushCell(acc)],
    [ifTypeEquals(pendingCellType), pipe(discardType, appendToPendingCells(acc))],
    [ifTypeEquals(discardType), always(acc)],
    [T, throwErrorWithMessage(`Unknown inc cur ${cur}`)],
  ]),
)(cur);

const handlePage = pipe(
  viewItems,
  transduce(xForm, accFn, makeResult()),
  flushPendingCellsIntoRowIfNotEmpty,
  dissoc('pendingCells'),
);

export const makeHandlePage = curry(handlePage);
