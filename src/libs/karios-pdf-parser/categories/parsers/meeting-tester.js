import {any, find, pipe, test, unless} from "ramda";
import {startsWithGpgOrFt, throwErrorWithMessage} from "../../utils";
import {meeting} from "../category-types";

const makeMeeting = () => ({category: meeting});

export const meetingTester = any(test(/meeting/i));

export const meetingParser = pipe(
  unless(meetingTester, throwErrorWithMessage('Not meeting strings')),
  find(startsWithGpgOrFt),
  makeMeeting,
);
