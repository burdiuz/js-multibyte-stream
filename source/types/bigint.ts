import { ITypeStatic } from './IType';
// to str => (8562541423123344634623144512312n).toString(2)
// from str => BigInt(`0b${str}`)

import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

/*
static length:
1 bit -- sign
1 - 127 bits value

variable length:
1 bit -- sign
4 bits -- length
7 - 127 bits -- value
*/
export class BigIntType implements IType {
  static readonly type = 'bigint';
  public signed: boolean;
  public size: number;
  public useTwosComplement: boolean = true;

  constructor(signed = true, size = 0) {
    this.signed = signed;
    this.size = size;
  }

  writeTo(writer: IBitWriter, value: number): void {}

  readFrom(reader: IBitReader): any {}

  toObject(type: BigIntType): ITypeData {
    return {
      type: BigIntType.type,
      signed: type.signed,
      size: this.size,
      twosComplement: this.useTwosComplement,
    };
  }

  static getInstance(signed?: boolean, size?: number): BigIntType {
    return new BigIntType(signed, size);
  }

  static getTypeKeys(): Array<string | Function> {
    return [BigIntType.type, Number, BigIntType];
  }

  static fromObject(data: ITypeData): BigIntType {
    const { signed = true, size = 0, twosComplement = true } = data;
    const instance = new BigIntType(signed as boolean, size as number);

    instance.useTwosComplement = twosComplement as boolean;

    return instance;
  }
}
