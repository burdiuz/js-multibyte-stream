import { TypedArray, IDataSource } from './idatasource';
import { Endian } from '../endian';

export interface IBaseBitRW {
  setData(data: TypedArray): void;
  setSource(source: IDataSource): void;

  getBitOrder(): Endian;
  setBitOrder(value: Endian): void;

  getPosition(): number;
  setPosition(value: number): void;
  getBytePosition(): number;
  getFrameSize(): number;
  getSource(): TypedArray;
}

export interface IBitWriter {
  write(value: number, bitCount: number): void;
}

export interface IBitReader {
  read(bitCount: number): number;
}

export interface IBitStream extends IBitReader, IBitWriter {}
