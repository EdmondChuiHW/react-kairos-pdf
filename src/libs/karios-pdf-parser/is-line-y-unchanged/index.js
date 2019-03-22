import {curryN, either, equals, isNil} from "ramda";

const isOldYNil = isNil;

// (number, number) => boolean
export const isLineYUnchanged = curryN(2, either(equals, isOldYNil));
