import {devotionParser, devotionTester} from "./devotion-tester";
import {devotion} from "../category-types";

describe('devotionTester', () => {
  it('should return true for matches', () => {
    expect(devotionTester([`"Power" devotion`])).toEqual(true);
    expect(devotionTester([`Devotion "Power"`])).toEqual(true);
  });

  it('should return true for changed', () => {
    expect(devotionTester([`"Power" devotion`, `(changed to "Dam" devotion)`])).toEqual(true);
    expect(devotionTester([`Devotion "Power"`, `(changed to devotion "Dam")`])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(devotionTester(['Contextualised Worship Service'])).toEqual(false);
    expect(devotionTester(['Introduction to Course'])).toEqual(false);
  });
});

describe('devotionParser', () => {
  it('should return devotion object for matches', () => {
    expect(devotionParser(['"Power" devotion']).topic).toEqual('Power');
    expect(devotionParser(['"Power" devotion']).category).toEqual(devotion);

    expect(devotionParser(['Devotion "Power"']).topic).toEqual('Power');
    expect(devotionParser(['Devotion "Power"']).category).toEqual(devotion);

    expect(devotionParser(['Devotion - Biblical Worldview']).topic).toEqual('Biblical Worldview');
    expect(devotionParser(['Devotion - Biblical Worldview']).category).toEqual(devotion);
  });

  it('should return changed topic', () => {
    expect(devotionParser([`"Power" devotion`, `(changed to) "Dam" devotion`]).topic).toEqual('Dam');
    expect(devotionParser([`Devotion "Power"`, `(changed to) devotion "Dam"`]).topic).toEqual('Dam');
  });

  it('should return empty for missing topic', () => {
    expect(devotionParser([`"" devotion`]).topic).toEqual('');
    expect(devotionParser([`Devotion ""`]).topic).toEqual('');
  });

  it('should throw for non-matches', () => {
    expect(() => devotionParser(['Contextualised Worship Service'])).toThrow(/not devotion strings/i);
    expect(() => devotionParser(['Introduction to Course'])).toThrow(/not devotion strings/i);
  });
});
