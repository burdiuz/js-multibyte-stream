/**
 * Revert bit value
 * @param Source Integer
 * @param Bit index
 */
const resetBit = (value, position) => {
  if (1 & value >> --position) {
    return value ^ 1 << position;
  }

  return value | 1 << position;
};

export default resetBit;
