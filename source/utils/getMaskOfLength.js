export const MASK_MAX_INDEX = 31;

export const MASKS = ((index) => {
  const list = [0];

  while (index > 0) {
    list[index] = Math.pow(2, index) - 1;
    index--;
  }

  return list;
})(MASK_MAX_LENGTH);

export const MAX_MASK = MASKS[MASK_MAX_INDEX];

export const getMaskOfLength = (length) => MASKS[length];
