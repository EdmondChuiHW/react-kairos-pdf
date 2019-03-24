import {always, cond, T} from "ramda";
import {worshipParser, worshipTester} from "./parsers/worship-tester";
import {devotionParser, devotionTester} from "./parsers/devotion-tester";
import {focusPrayerParser, focusPrayerTester} from "./parsers/focus-prayer-tester";
import {chapterReviewParser, chapterReviewTester} from "./parsers/chapter-review-tester";
import {chapterIntroParser, chapterIntroTester} from "./parsers/chapter-intro-tester";
import {videoParser, videoTester} from "./parsers/video-tester";

export const guessCategoryFromRawStrings = cond([
  [worshipTester, worshipParser],
  [devotionTester, devotionParser],
  [focusPrayerTester, focusPrayerParser],
  [chapterReviewTester, chapterReviewParser],
  [chapterIntroTester, chapterIntroParser],
  [videoTester, videoParser],
  [T, always({category: 'unknown'})],
]);
