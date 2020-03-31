
/**
 * Get an Array of values with cutom length.
 * @param Объект ByteArray Data source. Data left after reading Rect values will be forotten. ByteArray.position value will not be returned to value before this operation, so you can track where Array ends.
 * @param Bits of value length.
 * @param Array length, values count to read.
 * @param Base value for first byte, to use with first ByteArray value.
 * @param Длина начального значения, в битах.
 * @return Array
 */
static public function readBitArray(byteArray:ByteArray, length:int, count:int=1, baseValue:int=0, baseLength:int=0):Array{
  var list:Array = [];
  var index:int = 0;
  while(index<count){
    if(baseLength<length){
      baseValue = baseValue<<8 | byteArray.readUnsignedByte();
      baseLength += 8;
      continue;
    }
    var prop:int = baseValue >> (baseLength - length);
    if((1<<length-1 & prop)>>length-1) prop = -(prop&MASKS[length-1]);
    list[index] = prop;
    baseValue = baseValue&MASKS[baseLength-=length];
    index++;
  }
  return list;
}
