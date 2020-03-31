/**
 * Get bit value from source integer
 * @param source Integer
 * @param position index
 */
export const getBitAt = (value, position = 0) => (value >> position) & 1;
