/**
 * Get bit value from source integer
 * @param source Integer
 * @param position index
 */
export const getBitAt = (value: number, position = 0) =>
  (value >> position) & 1;
