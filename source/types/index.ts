import { BigIntType } from './bigint';
import { StringType } from './string';
import { IntType } from './int';
import { ObjectType } from './object';
import { ArrayType } from './array';
import { BoolType } from './bool';
export * from './registry';
import { addTypeDefinition } from './registry';

addTypeDefinition(BoolType);
addTypeDefinition(IntType);
addTypeDefinition(BigIntType);
addTypeDefinition(StringType);
addTypeDefinition(ObjectType);
addTypeDefinition(ArrayType);

export const types = {
  BigIntType,
  StringType,
  IntType,
  ObjectType,
  ArrayType,
  BoolType,
};
