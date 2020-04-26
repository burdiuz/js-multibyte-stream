import { BitWriter } from './source/stream/bitwriter';
import { BitReader } from './source/stream/bitreader';
import { IBitReader } from './source/stream/ibitstream';
export type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array;

export interface IDataSource {
  getPosition(): number;
  setPosition(value: number): void;
  getFrameSize(): number;
  getCurrentFrame(): number;
  setCurrentFrame(value: number): void;
  nextFrame(): void;
  previousFrame(): void;
  isLastFrame(): boolean;
  getFrame(index: number): number;
  setFrame(value: number, index: number): void;
  getLength(): number;
  setLength(length: number): void;
  getSource(): TypedArray;
  toString(start: number, length: number): string;
}

export enum Endian {
  BIG = 1,
  LITTLE = 0,
}

export interface IBaseBitRW {
  getData(): TypedArray;
  setData(data: TypedArray): void;
  getSource(): IDataSource;
  setSource(source: IDataSource): void;

  getBitOrder(): Endian;
  setBitOrder(value: Endian): void;

  getPosition(): number;
  setPosition(value: number): void;
  getBytePosition(): number;
  getFrameSize(): number;
}

export interface IBitWriter extends IBaseBitRW {
  write(value: number, bitCount: number): void;
  writeData(value: TypedArray, bitStart?: number, bitCount?: number): void;
}

export interface IBitReader extends IBaseBitRW {
  read(bitCount: number): number;
}

export interface IBitStream extends IBitReader, IBitWriter {}

type SimpleValue = string | number | boolean | SimpleObject | SimpleArray;

interface SimpleObject {
  [key: string]: SimpleValue;
}

type SimpleArray = Array<SimpleValue>;

export interface ITypeData {
  [key: string]: SimpleValue;
  type: string;
}

export interface IType {
  writeTo(writer: IBitWriter, value: any): void;
  readFrom(reader: IBitReader): any;
  toObject(): ITypeData;
}

export interface TypeRegistry {
  add(type: ITypeStatic): void;
  addTypeFor(key: string | Function, type: ITypeStatic): void;
  hasTypeFor(key: string | Function): boolean;
  getTypeFor(key: string | Function): ITypeStatic;
  fromObject(data: ITypeData): IType;
}

export interface ITypeStatic {
  type: string;
  getTypeKeys(): Array<string | Function>;
  getInstance(registry: TypeRegistry, ...args: any): IType;
  getInstanceFor(registry: TypeRegistry, value: any, ...args: any): IType;
  fromObject(data: ITypeData): IType;
}

export interface IBitReaderStatic {
  new (): IBitReader;
}

export declare const BitReader: IBitReaderStatic;

export interface IBitWriterStatic {
  new (): IBitWriter;
}

export declare const BitWriter: IBitWriterStatic;

export type Schema = IBitReader & IBitWriter;

export interface SchemaStatic {
  new (): Schema;
}

export declare const Schema: SchemaStatic;

export declare const readObjectFieldTypes: (
  data: { [key: string]: any },
  registry: TypeRegistry,
  target?: object
) => { [key: string]: IType };

export declare const defaultTypeRegistry: TypeRegistry;

export declare const addTypeDefinition: (...types: ITypeStatic[]) => void;

export declare const addTypeDefinitionFor: (
  key: string | Function,
  type: ITypeStatic
) => void;

export declare const hasTypeDefinitionFor: (key: string | Function) => boolean;

export declare const getTypeDefinitionFor: (
  key: string | Function
) => ITypeStatic;

export declare const getValueTypeDefinition: (value: any) => void;

export declare const types: {
  BigIntType: ITypeStatic;
  StringType: ITypeStatic;
  IntType: ITypeStatic;
  ShortType: ITypeStatic;
  ByteType: ITypeStatic;
  UIntType: ITypeStatic;
  UShortType: ITypeStatic;
  UByteType: ITypeStatic;
  SimpleFloatType: ITypeStatic;
  EnumType: ITypeStatic;
  ObjectType: ITypeStatic;
  ArrayType: ITypeStatic;
  BoolType: ITypeStatic;
};
