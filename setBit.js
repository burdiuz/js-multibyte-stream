import { MASKS } from './const';

/**
 * Get a bit value from source integer.
 * @param Source integer
 * @param Bit value 0 or 1 / false or true.
 * @param Bit index
 */
const setBit = (value, bitValue, position) => {
  if (bitValue) {
    return value | 1 << position - 1;
  }
  return value >> position << position | (value & MASKS[position - 1]);
};

export default setBit;
