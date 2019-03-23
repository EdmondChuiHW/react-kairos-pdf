import {worshipParser, worshipTester} from "./worship-tester";

describe('worshipTester', () => {
  it('should return true for matches', () => {
    expect(worshipTester(['Worship & Prayer', 'FT Team'])).toEqual(true);
    expect(worshipTester(['Worship & Prayer', 'GPG 2'])).toEqual(true);
  });

  it('should return true for missing assigned groups', () => {
    expect(worshipTester(['Worship & Prayer'])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(worshipTester(['Contextualised Worship Service'])).toEqual(false);
    expect(worshipTester(['Introduction to Course'])).toEqual(false);
  });
});

describe('worshipParser', () => {
  it('should return worship object for matches', () => {
    expect(worshipParser(['Worship & Prayer', 'FT Team']).assignedGroup).toEqual('FT Team');
    expect(worshipParser(['Worship & Prayer', 'FT Team']).category).toEqual('worship');

    expect(worshipParser(['Worship & Prayer', 'GPG 2']).assignedGroup).toEqual('GPG 2');
    expect(worshipParser(['Worship & Prayer', 'GPG 2']).category).toEqual('worship');
  });

  it('should return empty string for missing assigned groups', () => {
    expect(worshipParser(['Worship & Prayer']).assignedGroup).toEqual('');
    expect(worshipParser(['Worship & Prayer']).category).toEqual('worship');
  });

  it('should throw for non-matches', () => {
    expect(() => worshipParser(['Contextualised Worship Service'])).toThrow(/not worship strings/i);
    expect(() => worshipParser(['Introduction to Course'])).toThrow(/not worship strings/i);
  });
});
