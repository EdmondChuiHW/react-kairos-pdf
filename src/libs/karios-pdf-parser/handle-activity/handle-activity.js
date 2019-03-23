import {converge, curry, identity} from "ramda";

const makeActivity = curry((rawTexts, category) => ({rawTexts, category}));

export const handleActivity = converge(
  makeActivity, [
    identity,

  ],
);

