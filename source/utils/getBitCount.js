/**
 * Get bit count for value. Any value will have at least 1 bit length. Negative value gets +1 for sign.
 * @param Value to be calculated.
 * @param Include a sign bit into calculation
 */
export const getBitCount = (value) => {
  if (!value) {
    return 1;
  }

  if (value < 0) {
    value = -value;
  }

  return Math.ceil(Math.log2(value)) + 1;
};
