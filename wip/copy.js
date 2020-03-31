
/**
 * Copy source ByteArray data from position to position+length. It will copy endian and objectEncoding properties also.
 * @param Source ByteArray.
 */
[Inline]
static public function copy(source:ByteArray, position:uint=0, length:int=0):ByteArray{
  if(length==0){
    if(position==0) return clone(source);
    length = source.length;
  }else if(length<0){
    length = source.length-length;
  }
  var result:ByteArray = new ByteArray();
  result.endian = source.endian;
  result.objectEncoding = source.objectEncoding;
  var i:int = 0;
  while(position<length){
    result[i] = source[position];
    position++;
    i++;
  }
  return result;
}
