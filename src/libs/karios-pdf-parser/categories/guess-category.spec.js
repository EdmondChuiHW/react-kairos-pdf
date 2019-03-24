import {guessCategoryFromRawStrings} from "./guess-category";

describe('guessCategoryFromRawStrings', () => {
  it('should guess correct category', () => {
    const g = guessCategoryFromRawStrings;
    expect(g([`9:00`, `Chapter 7 "Culture C" Introduction`]).category).toEqual('chapter-intro');
    expect(g([`9:00`, `Chapter 7 "Culture C" Review`]).category).toEqual('chapter-review');
    expect(g([`9:00`, `Devotion "Power"`, `(changed to) devotion "Dam"`]).category).toEqual('devotion');
    expect(g([`9:00`, `LRP Prayer Focus - Buddhist`, 'FT Team']).category).toEqual('focus-prayer');
    expect(g([`9:00`, `Video "The Ends of the Earth" (20 min)`]).category).toEqual('video');
    expect(g([`9:00`, `Worship & Prayer`, 'FT Team']).category).toEqual('worship');
  });
});
