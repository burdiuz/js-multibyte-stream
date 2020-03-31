
/**
 * Get a Rectangle filled with x/y/with/height values from RECT marker  based on SWF specification.
 * @param Объект ByteArray Data source. Data left after reading Rect values will be forotten.
 * @return Rectangle
 */
[Inline]
static public function readRect(byteArray:ByteArray):Rectangle{
  var first:int = byteArray.readUnsignedByte();
  var length:int = first>>3;
  var list:Array = readBitArray(byteArray, length, 4, first&7, 3);
  return new Rectangle(list[0], list[2], list[1], list[3]);
}
