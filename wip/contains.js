
/**
 * Look if haystack ByteArray contains a needle ByteArray.
 */
[Inline]
static public function contains(haystack:ByteArray, needle:ByteArray):Boolean{
  return search(haystack, needle, 0, int.MAX_VALUE) !== -1;
}
