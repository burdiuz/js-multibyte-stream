
/**
 * Clone ByteArray.
 * @param Source ByteArray
 */
[Inline]
static public function clone(ba:ByteArray):ByteArray{
  var pos:int = ba.position;
  ba.position = 0;
  var con:ByteArray = new ByteArray();
  con.position = 0;
  con.writeBytes(ba);
  con.position = ba.position = pos;
  con.endian = ba.endian;
  con.objectEncoding = ba.objectEncoding;
  return con;

}
