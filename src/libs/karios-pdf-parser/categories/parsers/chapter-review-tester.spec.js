import {chapterReviewParser, chapterReviewTester} from "./chapter-review-tester";

describe('chapterReviewTester', () => {
  it('should return true for matches', () => {
    expect(chapterReviewTester([`Chapter 7 "Culture C" Review`])).toEqual(true);
    expect(chapterReviewTester([`Chapter 7 Review`])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(chapterReviewTester(['Contextualised Worship Service'])).toEqual(false);
    expect(chapterReviewTester(['Introduction to Course'])).toEqual(false);
  });
});

describe('chapterReviewParser', () => {
  it('should return devotion object for matches', () => {
    expect(chapterReviewParser([`Chapter 7 "Culture C" Review`]).number).toEqual(7);
    expect(chapterReviewParser([`Chapter 7 "Culture C" Review`]).topic).toEqual('Culture C');
    expect(chapterReviewParser([`Chapter 7 "Culture C" Review`]).category).toEqual('chapter-review');
  });

  it('should return [Unknown topic] for missing topic', () => {
    expect(chapterReviewParser([`Chapter 7 Review`]).number).toEqual(7);
    expect(chapterReviewParser([`Chapter 7 Review`]).topic).toEqual('[Unknown topic]');
    expect(chapterReviewParser([`Chapter 7 Review`]).category).toEqual('chapter-review');
  });

  it('should return -1 for missing index', () => {
    expect(chapterReviewParser([`Chapter "Culture C" Review`]).number).toEqual(-1);
    expect(chapterReviewParser([`Chapter "Culture C" Review`]).topic).toEqual('Culture C');
    expect(chapterReviewParser([`Chapter "Culture C" Review`]).category).toEqual('chapter-review');
  });

  it('should return -1 [Unknown topic] for missing', () => {
    expect(chapterReviewParser([`Chapter Review`]).number).toEqual(-1);
    expect(chapterReviewParser([`Chapter Review`]).topic).toEqual('[Unknown topic]');
    expect(chapterReviewParser([`Chapter Review`]).category).toEqual('chapter-review');
  });

  it('should throw for non-matches', () => {
    expect(() => chapterReviewParser(['Contextualised Worship Service'])).toThrow(/not chapter review strings/i);
    expect(() => chapterReviewParser(['Introduction to Course'])).toThrow(/not chapter review strings/i);
  });
});
