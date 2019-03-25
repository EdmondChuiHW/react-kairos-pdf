import {excelLinefeed, viewTextFromCategory} from "./utils";
import {pipe} from "ramda";
import {guessCategoryFromRawStrings} from "../libs/karios-pdf-parser/categories/guess-category";

describe('utils', () => {
  describe('viewTextFromCategory(…)', () => {
    it('should return short str', () => {
      const g = pipe(guessCategoryFromRawStrings, viewTextFromCategory);
      expect(g([`9:00`, `Chapter 7 "Culture C" Introduction`])).toEqual(`7 Culture C`);
      expect(g([`9:00`, `Chapter 7 "Culture C" Review`])).toEqual(`7 Culture C`);
      expect(g([`9:00`, `Devotion "Power"`, `(changed to) devotion "Dam"`])).toEqual(`Dam`);
      expect(g([`9:00`, `LRP Prayer Focus - Buddhist`, 'FT Team'])).toEqual(`Buddhist${excelLinefeed}- FT Team`);
      expect(g([`9:00`, `Video "The Ends of the Earth" (20 min)`])).toEqual(`The Ends of the Earth`);
      expect(g([`9:00`, `Worship & Prayer`, 'FT Team'])).toEqual(`FT Team`);
      expect(g([`9:00`, `Introduction to course`])).toEqual('');
    });
  });
});
