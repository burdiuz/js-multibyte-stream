
/**
 * Break integer value to parts.
 * @param Source value
 * @param Length of the value in bits
 * @param List of parts length that should be read
 */
[Inline]
static public function getParted(value:Number, max:int, ...args:Array):Array{
  var len:int = args.length;
  var arr:Array = new Array();
  var num:int = 0;
  for(var i:int=0; i<len; i++){
    max-= args[i];
    arr.push(value>>max);
    value = value&MASKS[max];
  }
  arr.push(value);
  return arr;
}
