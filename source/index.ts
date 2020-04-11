export * from './stream/bitstream';
export * from './stream/bitreader';
export * from './stream/bitwriter';
export * from './types/index';

/*
import { BitStream } from './stream/bitstream';
import { IntType } from './types/int';
import { ObjectType } from './types/object';
import { ArrayType } from './types/array';
import { BoolType } from './types/bool';
import { StringType } from './types/string';
import { BigIntType } from './types/bigint';

/*
 ======= debug
* /
declare const window: any;

window.exports = {};
window.stream = new BitStream();
window.int = new IntType();
window.bool = new BoolType();
window.obj = new ObjectType();
window.arr = new ArrayType();
window.big = new BigIntType();
window.str = new StringType();

const data = {
  bool: false,
  num: 777,
  big: 555555555555555555555555555555555n,
  arr: [1,2,3,4,5,6,7,8,9,0],
  obj: {
    one: true,
    two: false,
    three: true,
    num:8765,
  },
};

window.obj.writeTo(window.stream, data);
window.stream.setPosition(0);
console.log(window.obj.readFrom(window.stream));
//*/
