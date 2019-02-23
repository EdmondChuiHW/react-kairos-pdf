import {tallyActivityTimes} from "./index";
import * as moment from 'moment';

describe('karios-pdf-parser', function () {
  describe('tallyActivityTimes(…)', function () {
    it('should return moment with sum', () => {
      const actual = tallyActivityTimes([5, 12, 8]);
      expect(actual.asMilliseconds()).toEqual(moment.duration(25, 'minutes').asMilliseconds());
    });
  });
});
