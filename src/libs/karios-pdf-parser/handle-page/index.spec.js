import {isStrStartTime} from "./handle-page";

describe('isStrStartTime(…)', function () {
  it('should return start time valid', () => {
    expect(isStrStartTime('8:00')).toEqual(true);
    expect(isStrStartTime('16:00')).toEqual(true);
    expect(isStrStartTime('a:00')).toEqual(false);
    expect(isStrStartTime('800')).toEqual(false);
    expect(isStrStartTime('29:00')).toEqual(false);
  });
});
