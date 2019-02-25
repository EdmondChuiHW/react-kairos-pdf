import {handleRow, handleSession, tallyActivityTimes} from "./index";
import moment from 'moment';
import {ParsingErrors} from "./errors";

describe('karios-pdf-parser', function () {

  describe('tallyActivityTimes(…)', function () {
    it('should return moment with sum', () => {
      const actual = tallyActivityTimes([5, 12, 8]);
      expect(actual.asMilliseconds()).toEqual(moment.duration(25, 'minutes').asMilliseconds());
    });
  });

  describe('handleSession(…)', function () {
    it('should return correct result', () => {
      const actual = handleSession(`Session 2 - Thursday, 28 February, 2019`);
      const expectedTimeInMillis = moment('2019-02-28T00:00:00').valueOf();  // use local time zone
      expect(actual.result.sessionNumber).toEqual(2);
      expect(actual.result.date.valueOf()).toEqual(expectedTimeInMillis);
      expect(actual.meta.errors).toEqual([]);
    });

    it('should return correct session number despite wrong date', () => {
      const str = `Session 2 - Friday, 28 February, 2019`;  // 28 February, 2019 is a Thursday
      const actual = handleSession(str);
      expect(actual.result.sessionNumber).toEqual(2);
      expect(actual.result.date.isValid()).toEqual(false);
      expect(actual.meta.errors).toEqual([ParsingErrors.ofInvalidSession(str)]);
    });

    it('should return correct date despite wrong session', () => {
      const str = `Session a - Thursday, 28 February, 2019`;
      const actual = handleSession(str);
      const expectedTimeInMillis = moment('2019-02-28T00:00:00').valueOf();  // use local time zone
      expect(actual.result.sessionNumber).toEqual(Number.NaN);
      expect(actual.result.date.valueOf()).toEqual(expectedTimeInMillis);
      expect(actual.meta.errors).toEqual([ParsingErrors.ofInvalidSession(str)]);
    });
  });

  describe('handleRow(…)', function () {

    it('should return correct row', () => {
      const rawStr = ['7:40', '15', 'Chapter 1 Review', 'Recap (5 min)', 'Discussion (10 min)', 'Flavius Mui'];
      const actual = handleRow(rawStr);
      expect(actual.result.activityTexts).toEqual(["Chapter 1 Review", "Recap (5 min)", "Discussion (10 min)"]);
      expect(actual.result.declaredDuration.asMilliseconds()).toEqual(moment.duration(15, 'minutes').asMilliseconds());
      expect(actual.result.facilitator).toEqual("Flavius Mui");
      expect(actual.result.startTime.isValid()).toEqual(true);
      expect(actual.meta.errors).toEqual([]);
    });

    it('should return mismatched activity times', () => {
      const rawStr = ['7:40', '15', 'Chapter 1 Review', 'Recap (2 min)', 'Discussion (10 min)', 'Flavius Mui'];
      const actual = handleRow(rawStr);
      const activityTexts = ["Chapter 1 Review", "Recap (2 min)", "Discussion (10 min)"];

      expect(actual.result.activityTexts).toEqual(activityTexts);
      expect(actual.result.declaredDuration.asMilliseconds()).toEqual(moment.duration(15, 'minutes').asMilliseconds());
      expect(actual.result.facilitator).toEqual("Flavius Mui");
      expect(actual.result.startTime.isValid()).toEqual(true);
      expect(actual.meta.errors).toEqual([
        ParsingErrors.ofMismatchedDurations(`${15} | ${activityTexts}`, actual.result.declaredDuration, moment.duration(12, 'minutes'))
      ]);
    });

    it('should return handle empty duration', () => {
      const rawStr = ['7:40', '', 'Chapter 1 Review', 'Recap (2 min)', 'Discussion (10 min)', 'Flavius Mui'];
      const actual = handleRow(rawStr);
      const activityTexts = ["Chapter 1 Review", "Recap (2 min)", "Discussion (10 min)"];

      expect(actual.result.activityTexts).toEqual(activityTexts);
      expect(actual.result.declaredDuration.isValid()).toEqual(false);
      expect(actual.result.facilitator).toEqual("Flavius Mui");
      expect(actual.result.startTime.isValid()).toEqual(true);
      expect(actual.meta.errors).toEqual([
        ParsingErrors.ofMismatchedDurations(`${NaN} | ${activityTexts}`, actual.result.declaredDuration, moment.duration(12, 'minutes'))
      ]);
    });

  });
});
