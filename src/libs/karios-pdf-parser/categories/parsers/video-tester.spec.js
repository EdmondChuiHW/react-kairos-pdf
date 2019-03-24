import {videoParser, videoTester} from "./video-tester";

describe('videoTester', () => {
  it('should return true for matches', () => {
    expect(videoTester([`Video "The Ends of the Earth" (20 min)`])).toEqual(true);
    expect(videoTester([`Video - "The Ends of the Earth" (20 min)`])).toEqual(true);
  });

  it('should return true for changed', () => {
    expect(videoTester([`Video "The Ends of the Earth"`, `(changed to) Video "Role of Prayer" (30 min)`])).toEqual(true);
    expect(videoTester([`Video "The Ends of the Earth"`, `(changed to) Video - "Role of Prayer" (30 min)`])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(videoTester(['Contextualised Worship Service'])).toEqual(false);
    expect(videoTester(['Introduction to Course'])).toEqual(false);
  });
});

describe('videoParser', () => {
  it('should return video object for matches', () => {
    expect(videoParser([`Video "The Ends of the Earth" (20 min)`]).title).toEqual('The Ends of the Earth');
    expect(videoParser([`Video "The Ends of the Earth" (20 min)`]).category).toEqual('video');

    expect(videoParser(['Video - Biblical Worldview']).title).toEqual('Biblical Worldview');
    expect(videoParser(['Video - Biblical Worldview']).category).toEqual('video');
  });

  it('should return changed topic', () => {
    expect(videoParser([`Video "The Ends of the Earth"`, `(changed to) Video "Role of Prayer" (30 min)`]).title).toEqual('Role of Prayer');
    expect(videoParser([`Video "The Ends of the Earth"`, `(changed to) Video - "Role of Prayer" (30 min)`]).title).toEqual('Role of Prayer');
  });

  it('should return [Unknown topic] for missing topic', () => {
    expect(videoParser([`Video ""`]).title).toEqual('[Unknown video]');
    expect(videoParser([`Video - ""`]).title).toEqual('[Unknown video]');
  });

  it('should throw for non-matches', () => {
    expect(() => videoParser(['Contextualised Worship Service'])).toThrow(/not video strings/i);
    expect(() => videoParser(['Introduction to Course'])).toThrow(/not video strings/i);
  });
});
