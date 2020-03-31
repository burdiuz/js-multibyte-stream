
/**
 * Right crop of the value
 * @param Source value
 * @param Bit count to cut from right
 */
[Inline]
static public function getRCrop(value:Number, count:int):Number{
  return value&MASKS[count];
}
