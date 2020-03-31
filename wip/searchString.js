
/**
 * Get an index where needle string starts in haystack ByteArray.
 */
[Inline]
static public function searchString(haystack:ByteArray, needle:String, from:int=0, to:int=int.MAX_VALUE):int{
  const needleByteArray:ByteArray = new ByteArray();
  needleByteArray.writeUTFBytes(needle);
  return search(haystack, needleByteArray, from, to);
}
