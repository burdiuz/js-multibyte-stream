import { IBitWriter, IBitReader } from '../stream/ibitstream';
import { TypeRegistry } from './registry';

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

export interface ITypeStatic {
  type: string;
  getTypeKeys(): Array<string | Function>;
  getInstance(registry: TypeRegistry, ...args: any): IType;
  getInstanceFor(registry: TypeRegistry, value: any, ...args: any): IType;
  fromObject(data: ITypeData): IType;
}
