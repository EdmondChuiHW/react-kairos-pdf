import {chapterIntroParser, chapterIntroTester, viewChapterIndex, viewChapterTopic} from "./chapter-intro-tester";

describe('chapterIntroTester', () => {
  it('should return true for matches', () => {
    expect(chapterIntroTester([`Chapter 7 "Culture C" Introduction`])).toEqual(true);
    expect(chapterIntroTester([`Chapter 7 Introduction`])).toEqual(true);
    expect(chapterIntroTester([`Chapter Introduction`])).toEqual(true);
    expect(chapterIntroTester([`Introduction to Chapter 7 "Culture C"`])).toEqual(true);
    expect(chapterIntroTester([`Introduction to Chapter 7`])).toEqual(true);
    expect(chapterIntroTester([`Introduction to Chapter "Culture C"`])).toEqual(true);
    expect(chapterIntroTester([`Introduction to Chapter`])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(chapterIntroTester(['Contextualised Worship Service'])).toEqual(false);
    expect(chapterIntroTester(['Introduction to Course'])).toEqual(false);
  });
});

describe('viewChapterIndex', () => {
  it('should get index in post-intro', () => {
    expect(viewChapterIndex(['Chapter 7 "Culture C" Introduction', '7', `"Culture C"`])).toEqual('7');
  });
  it('should get index in pre-intro', () => {
    expect(viewChapterIndex([`Introduction to Chapter 7 "Culture C"`, undefined, undefined, '7', `"Culture C"`])).toEqual('7');
  });
});

describe('viewChapterTopic', () => {
  it('should get topic in post-intro', () => {
    expect(viewChapterTopic(['Chapter 7 "Culture C" Introduction', '7', `"Culture C"`])).toEqual(`"Culture C"`);
  });

  it('should get topic in pre-intro', () => {
    expect(viewChapterTopic([`Introduction to Chapter 7 "Culture C"`, undefined, undefined, '7', `"Culture C"`])).toEqual(`"Culture C"`);
  });
});

describe('chapterIntroParser', () => {
  it('should return devotion object for matches', () => {
    expect(chapterIntroParser([`Chapter 7 "Culture C" Introduction`]).index).toEqual(7);
    expect(chapterIntroParser([`Chapter 7 "Culture C" Introduction`]).topic).toEqual('Culture C');
    expect(chapterIntroParser([`Chapter 7 "Culture C" Introduction`]).category).toEqual('chapter-intro');

    expect(chapterIntroParser([`Introduction to Chapter 7 "Culture C"`]).index).toEqual(7);
    expect(chapterIntroParser([`Introduction to Chapter 7 "Culture C"`]).topic).toEqual('Culture C');
    expect(chapterIntroParser([`Introduction to Chapter 7 "Culture C"`]).category).toEqual('chapter-intro');
  });

  it('should return [Unknown topic] for missing topic', () => {
    expect(chapterIntroParser([`Chapter 7 Introduction`]).index).toEqual(7);
    expect(chapterIntroParser([`Chapter 7 Introduction`]).topic).toEqual('[Unknown topic]');
    expect(chapterIntroParser([`Chapter 7 Introduction`]).category).toEqual('chapter-intro');

    expect(chapterIntroParser([`Introduction to Chapter 7`]).index).toEqual(7);
    expect(chapterIntroParser([`Introduction to Chapter 7`]).topic).toEqual('[Unknown topic]');
    expect(chapterIntroParser([`Introduction to Chapter 7`]).category).toEqual('chapter-intro');
  });

  it('should return -1 for missing index', () => {
    expect(chapterIntroParser([`Chapter "Culture C" Introduction`]).index).toEqual(-1);
    expect(chapterIntroParser([`Chapter "Culture C" Introduction`]).topic).toEqual('Culture C');
    expect(chapterIntroParser([`Chapter "Culture C" Introduction`]).category).toEqual('chapter-intro');

    expect(chapterIntroParser([`Introduction to Chapter "Culture C"`]).index).toEqual(-1);
    expect(chapterIntroParser([`Introduction to Chapter "Culture C"`]).topic).toEqual('Culture C');
    expect(chapterIntroParser([`Introduction to Chapter "Culture C"`]).category).toEqual('chapter-intro');
  });

  it('should return -1 [Unknown topic] for missing', () => {
    expect(chapterIntroParser([`Chapter Introduction`]).index).toEqual(-1);
    expect(chapterIntroParser([`Chapter Introduction`]).topic).toEqual('[Unknown topic]');
    expect(chapterIntroParser([`Chapter Introduction`]).category).toEqual('chapter-intro');

    expect(chapterIntroParser([`Introduction to Chapter`]).index).toEqual(-1);
    expect(chapterIntroParser([`Introduction to Chapter`]).topic).toEqual('[Unknown topic]');
    expect(chapterIntroParser([`Introduction to Chapter`]).category).toEqual('chapter-intro');
  });

  it('should throw for non-matches', () => {
    expect(() => chapterIntroParser(['Contextualised Worship Service'])).toThrow(/not chapter intro strings/i);
    expect(() => chapterIntroParser(['Introduction to Course'])).toThrow(/not chapter intro strings/i);
  });
});
