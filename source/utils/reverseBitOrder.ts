export const reverseBitOrder = (value: number, length: number): number => {
  let pos = length - 1;
  let result = 0;

  while (pos >= 0) {
    result = (result << 1) | (value >> pos);
    pos--;
  }

  return result;
};
