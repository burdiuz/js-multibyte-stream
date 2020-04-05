import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

/*
static length:
2 bits -- size of length block
8 - 16 bits -- length of the value
0 - ... -- value, max supported length is 65535 bytes
*/
/*
For variable length string it should be separated in groups:
0 group -- 0 - 127
1 group -- 127 - ...
2 bits -- size of length block
4 - 16 bits -- length of the string value

cycle:
  1 bit -- group

  2 bits -- length of group offset(4, 8, 12, 16 bits)
  4 - 16 bits -- group offset
  2 bits -- length of char size(4, 8, 12, 16 bits)
  4 - 16 bits -- char size


  2 bits -- size of length block
  4 - 16 bits -- length of the group
*/
export class StringType implements IType {
  static readonly type = 'string';

  writeTo(writer: IBitWriter, value: string): void {}

  readFrom(reader: IBitReader): any {}

  toObject(type: StringType): ITypeData {
    return { type: StringType.type };
  }

  static getTypeKeys(): Array<string | Function> {
    return [StringType.type, String, StringType];
  }

  static getInstance(): IType {
    return new StringType();
  }

  static fromObject(data: ITypeData): StringType {
    return new StringType();
  }
}
