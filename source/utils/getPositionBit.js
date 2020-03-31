export const MAX_POW_INDEX = 31;

export const POWS = ((index) => {
  const list = [];

  while (index >= 0) {
    list[index] = (1 << index) >>> 0;
    index--;
  }

  return list;
})(MAX_POW_INDEX);

export const getPositionBit = (index) => POWS[index];
