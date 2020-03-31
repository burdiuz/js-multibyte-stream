
/**
 * Get an index where needle ByteArray starts in haystack ByteArray.
 */
[Inline]
static public function search(haystack:ByteArray, needle:ByteArray, from:int=0, to:int=int.MAX_VALUE):int{
  var length:int = haystack.length;
  if(length>to) length = to;
  const nLength:int = needle.length;
  search: for(var i:int=from; i<length; ++i){
    for(var j:int = 0; j<nLength; ++j){
      var pos:int = i+j;
      if (pos>=length || haystack[pos] !== needle[j]){
        continue search;
      }
    }
    return i;
  }
  return -1;
}
