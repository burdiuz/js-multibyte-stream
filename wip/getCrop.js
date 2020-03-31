
static public function getCrop(value:Number, count:int, length:int):Number{
  return value >> (length-count);
}
