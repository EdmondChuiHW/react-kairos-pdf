import {handleRow} from "./handle-row";
import moment from "moment";
import {ParsingErrors} from "../errors";

describe('handleRow(…)', function () {

  it('should return correct row', () => {
    const rawStr = ['7:40', '15', 'Chapter 1 Review', 'Recap (5 min)', 'Discussion (10 min)', 'Flavius Mui'];
    const actual = handleRow(rawStr);
    expect(actual.activityTexts).toEqual(["Chapter 1 Review", "Recap (5 min)", "Discussion (10 min)"]);
    expect(actual.declaredDuration.asMilliseconds()).toEqual(moment.duration(15, 'minutes').asMilliseconds());
    expect(actual.facilitator).toEqual("Flavius Mui");
    expect(actual.startTime.isValid()).toEqual(true);
    expect(actual.category.category).toEqual('chapter-review');
    expect(actual.category.number).toEqual(1);
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
    expect(actual.category.category).toEqual('chapter-review');
    expect(actual.category.number).toEqual(1);
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
    expect(actual.category.category).toEqual('chapter-review');
    expect(actual.category.number).toEqual(1);
    expect(actual.errors).toEqual([
      ParsingErrors.ofMismatchedDurations(`${NaN} | ${activityTexts}`, actual.declaredDuration, moment.duration(12, 'minutes')),
    ]);
  });

});
