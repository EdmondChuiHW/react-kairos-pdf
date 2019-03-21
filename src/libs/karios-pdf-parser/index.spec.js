import {handleSession, isStrStartTime, stringsToTimeTotal, tallyActivityTimes} from "./index";
import moment from 'moment';
import {ParsingErrors} from "./errors";
import {handleRow} from "./handle-row";

describe('karios-pdf-parser', function () {

  describe('tallyActivityTimes(…)', function () {
    it('should return moment with sum', () => {
      const actual = tallyActivityTimes([5, 12, 8]);
      expect(actual.asMilliseconds()).toEqual(moment.duration(25, 'minutes').asMilliseconds());
    });
  });

  describe('isStrStartTime(…)', function () {
    it('should return start time valid', () => {
      expect(isStrStartTime('8:00')).toEqual(true);
      expect(isStrStartTime('16:00')).toEqual(true);
      expect(isStrStartTime('a:00')).toEqual(false);
      expect(isStrStartTime('800')).toEqual(false);
      expect(isStrStartTime('29:00')).toEqual(false);
    });
  });

  describe('stringsToTimeTotal(…)', function () {
    it('should tally as zero if none found', () => {
      expect(stringsToTimeTotal(['aewfe', 'aafe']).asMilliseconds()).toEqual(0);
    });

    it('should tally partial', () => {
      expect(stringsToTimeTotal(['aewfe', 'a (2 min)']).asMilliseconds()).toEqual(2 * 60 * 1000);
    });

    it('should tally all', () => {
      expect(stringsToTimeTotal(['aewfe (3 min)', 'eqf (2 min)']).asMilliseconds()).toEqual(5 * 60 * 1000);
    });

    it('should tally all with s', () => {
      expect(stringsToTimeTotal(['aewfe (3 mins)', 'eqf (2 min)']).asMilliseconds()).toEqual(5 * 60 * 1000);
    });
  });

  describe('handleSession(…)', function () {
    it('should return correct result', () => {
      const actual = handleSession(`Session 2 - Thursday, 28 February, 2019`);
      const expectedTimeInMillis = moment('2019-02-28T00:00:00').valueOf();  // use local time zone
      expect(actual.sessionNumber).toEqual(2);
      expect(actual.date.valueOf()).toEqual(expectedTimeInMillis);
      expect(actual.errors).toEqual([]);
    });

    it('should return correct session number despite wrong date', () => {
      const str = `Session 2 - Friday, 28 February, 2019`;  // 28 February, 2019 is a Thursday
      const actual = handleSession(str);
      expect(actual.sessionNumber).toEqual(2);
      expect(actual.date.isValid()).toEqual(false);
      expect(actual.errors).toEqual([ParsingErrors.ofInvalidSession(str)]);
    });

    it('should return correct date despite wrong session', () => {
      const str = `Session a - Thursday, 28 February, 2019`;
      const actual = handleSession(str);
      const expectedTimeInMillis = moment('2019-02-28T00:00:00').valueOf();  // use local time zone
      expect(actual.sessionNumber).toEqual(Number.NaN);
      expect(actual.date.valueOf()).toEqual(expectedTimeInMillis);
      expect(actual.errors).toEqual([ParsingErrors.ofInvalidSession(str)]);
    });
  });

  describe('handleRow(…)', function () {

    it('should return correct row', () => {
      const rawStr = ['7:40', '15', 'Chapter 1 Review', 'Recap (5 min)', 'Discussion (10 min)', 'Flavius Mui'];
      const actual = handleRow(rawStr);
      expect(actual.activityTexts).toEqual(["Chapter 1 Review", "Recap (5 min)", "Discussion (10 min)"]);
      expect(actual.declaredDuration.asMilliseconds()).toEqual(moment.duration(15, 'minutes').asMilliseconds());
      expect(actual.facilitator).toEqual("Flavius Mui");
      expect(actual.startTime.isValid()).toEqual(true);
      expect(actual.errors).toEqual([]);
    });

    it('should return mismatched activity times', () => {
      const rawStr = ['7:40', '15', 'Chapter 1 Review', 'Recap (2 min)', 'Discussion (10 min)', 'Flavius Mui'];
      const actual = handleRow(rawStr);
      const activityTexts = ["Chapter 1 Review", "Recap (2 min)", "Discussion (10 min)"];

      expect(actual.activityTexts).toEqual(activityTexts);
      expect(actual.declaredDuration.asMilliseconds()).toEqual(moment.duration(15, 'minutes').asMilliseconds());
      expect(actual.facilitator).toEqual("Flavius Mui");
      expect(actual.startTime.isValid()).toEqual(true);
      expect(actual.errors).toEqual([
        ParsingErrors.ofMismatchedDurations(`${15} | ${activityTexts}`, actual.declaredDuration, moment.duration(12, 'minutes')),
      ]);
    });

    it('should return handle empty duration', () => {
      const rawStr = ['7:40', '', 'Chapter 1 Review', 'Recap (2 min)', 'Discussion (10 min)', 'Flavius Mui'];
      const actual = handleRow(rawStr);
      const activityTexts = ["Chapter 1 Review", "Recap (2 min)", "Discussion (10 min)"];

      expect(actual.activityTexts).toEqual(activityTexts);
      expect(actual.declaredDuration.isValid()).toEqual(false);
      expect(actual.facilitator).toEqual("Flavius Mui");
      expect(actual.startTime.isValid()).toEqual(true);
      expect(actual.errors).toEqual([
        ParsingErrors.ofMismatchedDurations(`${NaN} | ${activityTexts}`, actual.declaredDuration, moment.duration(12, 'minutes')),
      ]);
    });

  });
});
