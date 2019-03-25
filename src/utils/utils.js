import {always, cond, dropLast, filter, head, join, pathEq, pipe, prop, propEq, props, split, T} from "ramda";
import {
  chapterIntro,
  chapterReview,
  devotion,
  focusPrayer,
  other,
  video,
  worship,
} from "../libs/karios-pdf-parser/categories/category-types";
import {stripAllQuotes} from "../libs/karios-pdf-parser/utils";

export function pushToArrayAtKey(obj, key, newItem) {
  if (!obj[key]) {
    obj[key] = [];
  }
  obj[key].push(newItem);
}


const catEq = propEq('category');

export const viewTextFromCategory = cond([
  [catEq(chapterIntro), pipe(props(['number', 'topic']), join(' '))],
  [catEq(chapterReview), pipe(props(['number', 'topic']), join(' '))],
  [catEq(devotion), prop('topic')],
  [catEq(focusPrayer), pipe(props(['prayerTarget', 'assignedGroup']), join('\n'))],
  [catEq(video), prop('title')],
  [catEq(worship), prop('assignedGroup')],
  [catEq(other), always('')],
  [T, always('')],
]);

const rowCatEq = pathEq(['category', 'category']);

export const fallbackTextForRow = cond([
  [rowCatEq(video), pipe(prop('activityTexts'), head, stripAllQuotes)],
  [T, pipe(prop('activityTexts'), join('\n'))],
]);

export const collectRowsUnderSessionIndex = sI => filter(propEq('sessionIndex', sI));
export const formatAsShortName = pipe(split(' '), dropLast(1), join(' '));

export const formatSessionDateStr = sessionTime => sessionTime.format('MMM D (ddd)');
export const formatRowTimeStr = rowTime => rowTime.format('h:mm');
export const formatStartEndTimeStr = (a, b) => `${formatRowTimeStr(a)}-${formatRowTimeStr(b)}`;
