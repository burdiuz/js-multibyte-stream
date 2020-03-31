
static public function readUnsignedBitArray(byteArray:ByteArray, length:int, count:int=1, baseValue:int=0, baseLength:int=0):Array{
  var list:Array = new Array();
  var index:int = 0;
  while(index<count){
    if(baseLength<length){
      baseValue = baseValue<<8 | byteArray.readUnsignedByte();
      baseLength += 8;
      continue;
    }
    list[index] = baseValue >> (baseLength - length);
    baseValue = baseValue&MASKS[baseLength-=length];
    index++;
  }
  return list;
}
