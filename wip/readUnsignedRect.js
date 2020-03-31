
/**
 * Reads Rectangle values as unsigned integers.
 * @see aw.utils.BinUtils:readRect
 */
[Inline]
static public function readUnsignedRect(byteArray:ByteArray):Rectangle{
  var first:int = byteArray.readUnsignedByte();
  var length:int = first>>3;
  var arr:Array = readUnsignedBitArray(byteArray, length, 4, first&7, 3);
  return new Rectangle(arr[0], arr[2], arr[1], arr[3]);
}
