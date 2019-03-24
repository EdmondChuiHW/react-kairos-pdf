import {guessCategoryFromRawStrings} from "./guess-category";
import {chapterIntro, chapterReview, devotion, focusPrayer, unknown, video, worship} from "./category-types";

describe('guessCategoryFromRawStrings', () => {
  it('should guess correct category', () => {
    const g = guessCategoryFromRawStrings;
    expect(g([`9:00`, `Chapter 7 "Culture C" Introduction`]).category).toEqual(chapterIntro);
    expect(g([`9:00`, `Chapter 7 "Culture C" Review`]).category).toEqual(chapterReview);
    expect(g([`9:00`, `Devotion "Power"`, `(changed to) devotion "Dam"`]).category).toEqual(devotion);
    expect(g([`9:00`, `LRP Prayer Focus - Buddhist`, 'FT Team']).category).toEqual(focusPrayer);
    expect(g([`9:00`, `Video "The Ends of the Earth" (20 min)`]).category).toEqual(video);
    expect(g([`9:00`, `Worship & Prayer`, 'FT Team']).category).toEqual(worship);
    expect(g([`9:00`, `Introduction to course`]).category).toEqual(unknown);
  });
});
