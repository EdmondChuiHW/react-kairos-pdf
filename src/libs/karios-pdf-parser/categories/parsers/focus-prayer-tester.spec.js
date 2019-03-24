import {focusPrayerParser, focusPrayerTester} from "./focus-prayer-tester";
import {focusPrayer} from "../category-types";

describe('focusPrayerTester', () => {
  it('should return true for matches', () => {
    expect(focusPrayerTester(['LRP Prayer Focus - Buddhist', 'FT Team'])).toEqual(true);
    expect(focusPrayerTester(['LRP Prayer Focus - Non-Religious Bloc', 'GPG 2'])).toEqual(true);
  });

  it('should return true for missing assigned groups', () => {
    expect(focusPrayerTester(['LRP Prayer Focus - Buddhist'])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(focusPrayerTester(['Contextualised Worship Service'])).toEqual(false);
    expect(focusPrayerTester(['Introduction to Course'])).toEqual(false);
  });
});

fdescribe('focusPrayerParser', () => {
  it('should return worship object for matches', () => {
    expect(focusPrayerParser(['LRP Prayer Focus - Buddhist', 'FT Team']).assignedGroup).toEqual('FT Team');
    expect(focusPrayerParser(['LRP Prayer Focus - Buddhist', 'FT Team']).prayerTarget).toEqual('Buddhist');
    expect(focusPrayerParser(['LRP Prayer Focus - Buddhist', 'FT Team']).category).toEqual(focusPrayer);

    expect(focusPrayerParser(['LRP Prayer Focus - Non-Religious Bloc', 'GPG 2']).assignedGroup).toEqual('GPG 2');
    expect(focusPrayerParser(['LRP Prayer Focus - Non-Religious Bloc', 'GPG 2']).prayerTarget).toEqual('Non-Religious Bloc');
    expect(focusPrayerParser(['LRP Prayer Focus - Non-Religious Bloc', 'GPG 2']).category).toEqual(focusPrayer);
  });

  it('should return empty string for missing assigned group', () => {
    expect(focusPrayerParser(['LRP Prayer Focus - Buddhist']).assignedGroup).toEqual('');
    expect(focusPrayerParser(['LRP Prayer Focus - Buddhist']).prayerTarget).toEqual('Buddhist');
    expect(focusPrayerParser(['LRP Prayer Focus - Buddhist']).category).toEqual(focusPrayer);
  });

  it('should return [Unknown prayer target] for missing prayer target', () => {
    expect(focusPrayerParser(['LRP Prayer Focus', 'GPG 2']).assignedGroup).toEqual('GPG 2');
    expect(focusPrayerParser(['LRP Prayer Focus', 'GPG 2']).prayerTarget).toEqual('[Unknown prayer target]');
    expect(focusPrayerParser(['LRP Prayer Focus', 'GPG 2']).category).toEqual(focusPrayer);
  });

  it('should throw for non-matches', () => {
    expect(() => focusPrayerParser(['Contextualised Worship Service'])).toThrow(/not focus prayer strings/i);
    expect(() => focusPrayerParser(['Introduction to Course'])).toThrow(/not focus prayer strings/i);
  });
});
