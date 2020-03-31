
/**
 * Look if string included into haystack ByteArray.
 */
[Inline]
static public function containsString(haystack:ByteArray, needle:String):Boolean{
  var result:Boolean = searchString(haystack, needle, 0, int.MAX_VALUE) !== -1;
  return result;
}
