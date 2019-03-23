import {either, isEmpty, isNil, test} from "ramda";

export const startsWithGpgOrFt = test(/^(?:ft)|^(?:gpg)/i);
export const isNilOrEmpty = either(isNil, isEmpty);
