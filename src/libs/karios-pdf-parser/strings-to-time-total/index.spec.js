import {stringsToTimeTotal} from "./strings-to-time-total";

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
