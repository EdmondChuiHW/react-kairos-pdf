import {isLineYUnchanged} from "./index";

describe('isLineUnchanged(…)', function () {
  it('should return true for same Y', () => {
    expect(isLineYUnchanged(0, 0)).toEqual(true);
    expect(isLineYUnchanged(0)(0)).toEqual(true);
    expect(isLineYUnchanged(3, 3)).toEqual(true);
    expect(isLineYUnchanged(3)(3)).toEqual(true);
  });

  it('should return true for nil old Y', () => {
    expect(isLineYUnchanged(null, 1)).toEqual(true);
    expect(isLineYUnchanged(null)(1)).toEqual(true);
    expect(isLineYUnchanged(undefined, 1)).toEqual(true);
    expect(isLineYUnchanged(undefined)(1)).toEqual(true);
  });

  it('should return false for different Y', () => {
    expect(isLineYUnchanged(0, 1)).toEqual(false);
    expect(isLineYUnchanged(0)(1)).toEqual(false);
  });
});
