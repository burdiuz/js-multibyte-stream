
/**
 * Return left binary part of a source number
 * @param Source value
 * @param Length of a cut in bits
 * @param Length of source number in bits
 */
[Inline]
static public function getLCrop(value:Number, count:int, length:int):Number{
  return value >> (length-count);
}
