import {meeting} from "../category-types";
import {meetingParser, meetingTester} from "./meeting-tester";

describe('meetingTester', () => {
  it('should return true for matches', () => {
    expect(meetingTester(['Facilitator meeting'])).toEqual(true);
    expect(meetingTester(['Participants: Lunch and WS', 'Facilitators: Lunch, Meeting and WS marking'])).toEqual(true);
    expect(meetingTester(['FT meeting'])).toEqual(true);
  });

  it('should return false for non-matches', () => {
    expect(meetingTester(['Contextualised Worship Service'])).toEqual(false);
    expect(meetingTester(['Introduction to Course'])).toEqual(false);
  });
});

describe('meetingParser', () => {
  it('should return meeting object for matches', () => {
    expect(meetingParser(['Facilitator meeting']).category).toEqual(meeting);
    expect(meetingParser(['Participants: Lunch and WS', 'Facilitators: Lunch, Meeting and WS marking']).category).toEqual(meeting);
    expect(meetingParser(['FT meeting']).category).toEqual(meeting);
  });

  it('should throw for non-matches', () => {
    expect(() => meetingParser(['Contextualised Worship Service'])).toThrow(/not meeting strings/i);
    expect(() => meetingParser(['Introduction to Course'])).toThrow(/not meeting strings/i);
  });
});
