export const ParsingErrors = {
  invalidSession: "invalidSession",
  ofInvalidSession(rawStr) {
    return {
      rawStr,
      type: ParsingErrors.invalidSession,
    };
  },

  mismatchedDurations: "mismatchedDurations",
  ofMismatchedDurations(rawStr, declaredDuration, totalDuration) {
    return {
      rawStr,
      type: ParsingErrors.mismatchedDurations,
      declaredDuration,
      totalDuration
    };
  },
};

