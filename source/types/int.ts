import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

/*
static length:
1 bit -- sign
1 - 31 bits value

variable length:
1 bit -- sign
2 bits -- length
7 - 31 bits -- value
*/
export class IntType implements IType {
  static readonly type = 'int';
  public signed: boolean;
  public size: number;
  public useTwosComplement: boolean = true;

  constructor(signed = true, size = 0) {
    this.signed = signed;
    this.size = size;
  }

  getTypeKeys(): Array<string | Function> {
    return [IntType.type, Number, IntType];
  }

  writeTo(writer: IBitWriter, value: number): void {

  }

  readFrom(reader: IBitReader): any {

  }

  toObject(type: IntType): ITypeData {
    return {
      type: IntType.type,
      signed: type.signed,
      size: this.size,
      twosComplement: this.useTwosComplement,
    };
  }

  static fromObject(data: ITypeData): IntType {
    const { signed = true, size = 0, twosComplement = true } = data;
    const instance = new IntType(signed as boolean, size as number);

    instance.useTwosComplement = twosComplement as boolean;

    return instance;
  }
}
