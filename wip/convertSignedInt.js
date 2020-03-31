
/**
 * Normalize signed integer, converts from two's complement number to normal notaition.
 *  AS3 uses two's complement nuumbers to represent negative integers - in a binary representation,
 * all bits will be inverted(1->0, 0->1) and to whole number will added 1. For example, if you will
 * store byte -3, you will get binary value of 11111101, except 10000011.
 <listing version="3.0">
 import flash.utils.ByteArray;
 import aw.utils.BinUtils;
 var i:int = -3;
 var ba:ByteArray = new ByteArray();
 ba.writeByte(i);
 ba.position = 0;
 trace(ba.readUnsignedByte().toString(2));
 trace(BinUtils.convertSignedInt(i, 8).toString(2));
 </listing>
 * @param Value
 * @param Value length in bits
 */
[Inline]
static public function convertSignedInt(i:int, len:uint=32):uint{
  if(i>=0) return i;
  return -i | 1<<(len-1);
}
