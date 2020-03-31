
/**
 * Converts normal integer value to negative adding last bit set to 1.
 * @param uint Source value
 * @param uint Max length of the value that is for byte 8, short - 16 and integer - 32(by default).
 */
[Inline]
static public function convertToNegative(value:uint, length:uint=32):int{
  return -(--value^MASKS[length]);
}
