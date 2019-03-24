import {always, cond, join, pipe, prop, propEq, props, T} from "ramda";
import {
  chapterIntro,
  chapterReview,
  devotion,
  focusPrayer,
  unknown,
  video,
  worship,
} from "../libs/karios-pdf-parser/categories/category-types";

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
  [catEq(unknown), always('')],
  [T, always('')],
]);
