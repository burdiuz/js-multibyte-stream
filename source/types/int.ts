import { getBitCount } from './../utils/getBitCount';
import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';
import {
  toTwosComplementRepresentation,
  fromTwosComplementRepresentation,
} from '../utils/twosComplement';
import {
  toOnesComplementRepresentation,
  fromOnesComplementRepresentation,
} from '../utils/onesComplement';

const writeInteger = (
  writer: IBitWriter,
  value: number,
  size: number,
  signed: boolean,
  twosc: boolean
): void => {
  if (!signed) {
    writer.write(value < 0 ? -value : value, size);
  }

  writer.write(
    (twosc ? toTwosComplementRepresentation : toOnesComplementRepresentation)(
      value,
      size
    ),
    size
  );
};

const writeVariableLengthInteger = (
  writer: IBitWriter,
  value: number,
  signed: boolean,
  twosc: boolean
): void => {
  const size = getBitCount(value) + +signed;
  const length = Math.ceil(size / 4 || 1) - 1;

  writer.write(length, 3);

  writeInteger(writer, value, (length + 1) << 2, signed, twosc);
};

const readInteger = (
  reader: IBitReader,
  size: number,
  signed: boolean,
  twosc: boolean
): number => {
  const value = reader.read(size);

  if (!signed) {
    return value;
  }

  return (twosc
    ? fromTwosComplementRepresentation
    : fromOnesComplementRepresentation)(value, size);
};

const readVariableLengthInteger = (
  reader: IBitReader,
  signed: boolean,
  twosc: boolean
): number => {
  const size = (reader.read(3) + 1) << 2;

  return readInteger(reader, size, signed, twosc);
};

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

  writeTo(writer: IBitWriter, value: number): void {
    if (this.size) {
      writeInteger(
        writer,
        value,
        this.size,
        this.signed,
        this.useTwosComplement
      );
    } else {
      writeVariableLengthInteger(
        writer,
        value,
        this.signed,
        this.useTwosComplement
      );
    }
  }

  readFrom(reader: IBitReader): number {
    if (this.size) {
      return readInteger(
        reader,
        this.size,
        this.signed,
        this.useTwosComplement
      );
    }

    return readVariableLengthInteger(
      reader,
      this.signed,
      this.useTwosComplement
    );
  }

  toObject(): ITypeData {
    return {
      type: IntType.type,
      signed: this.signed,
      size: this.size,
      twosComplement: this.useTwosComplement,
    };
  }

  static getInstance(signed?: boolean, size?: number): IType {
    return new IntType(signed, size);
  }

  static getTypeKeys(): Array<string | Function> {
    return [IntType.type, Number, IntType];
  }

  static fromObject(data: ITypeData): IntType {
    const { signed = true, size = 0, twosComplement = true } = data;
    const instance = new IntType(signed as boolean, size as number);

    instance.useTwosComplement = twosComplement as boolean;

    return instance;
  }
}
