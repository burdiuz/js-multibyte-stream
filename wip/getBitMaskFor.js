
/**
 * Returns value's mask  -- same count of bits but filled with "1".
 */
//FIXME this one is broken, it should get count of bits first and return mask for cont not value
static public function getPow(value:int):Number{
  return MASKS[value];
}


/**
 * Gets bit count of the value and returns its mask.
 */
//FIXME looks correct
static public function getValuesPow(value:uint):Number{
  var pow:uint = 1;
  var i:int = 0;
  while(i<MASK_MAX_LENGTH && (pow = MASKS[i])<value){
    i++;
  }
  return pow;
}
