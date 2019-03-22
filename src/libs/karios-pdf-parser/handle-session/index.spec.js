import {handleSession} from "./handle-session";
import moment from "moment";
import {ParsingErrors} from "../errors";

describe('handleSession(…)', function () {
  it('should return correct result', () => {
    const actual = handleSession(`Session 2 - Thursday, 28 February, 2019`, []);
    const expectedTimeInMillis = moment('2019-02-28T00:00:00').valueOf();  // use local time zone
    expect(actual.sessionNumber).toEqual(2);
    expect(actual.date.valueOf()).toEqual(expectedTimeInMillis);
    expect(actual.errors).toEqual([]);
  });

  it('should return correct session number despite wrong date', () => {
    const str = `Session 2 - Friday, 28 February, 2019`;  // 28 February, 2019 is a Thursday
    const actual = handleSession(str, []);
    expect(actual.sessionNumber).toEqual(2);
    expect(actual.date.isValid()).toEqual(false);
    expect(actual.errors).toEqual([ParsingErrors.ofInvalidSession(str)]);
  });

  it('should return correct date despite wrong session', () => {
    const str = `Session a - Thursday, 28 February, 2019`;
    const actual = handleSession(str, []);
    const expectedTimeInMillis = moment('2019-02-28T00:00:00').valueOf();  // use local time zone
    expect(actual.sessionNumber).toEqual(Number.NaN);
    expect(actual.date.valueOf()).toEqual(expectedTimeInMillis);
    expect(actual.errors).toEqual([ParsingErrors.ofInvalidSession(str)]);
  });
});
