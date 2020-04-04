import { IBitReader, IBitWriter } from './ibitstream';
import { BitReader } from './bitreader';
import {
  createWritableSource,
  BitWriter,
} from './bitwriter';
import { TypedArray, IDataSource } from './idatasource';
import { Endian } from '../../endian';

export class BitStream implements IBitReader, IBitWriter {
  private reader: BitReader;
  private writer: BitWriter;

  constructor(data: TypedArray) {
    this.writer = new BitWriter();
    this.reader = new BitReader();

    if (data !== undefined) {
      this.setData(data);
    }
  }

  setData(data: TypedArray): void {
    const source = createWritableSource(data);

    this.setSource(source);
  }

  setSource(source: IDataSource): void {
    this.writer.setSource(source);
    this.reader.setSource(source);
  }

  getBitOrder(): Endian {
    return this.reader.getBitOrder();
  }

  setBitOrder(value: Endian): void {
    this.writer.setBitOrder(value);
    this.reader.setBitOrder(value);
  }

  getPosition(): number {
    return this.reader.getPosition();
  }

  setPosition(value: number): void {
    this.writer.setPosition(value);
    this.reader.setPosition(value);
  }

  getBytePosition(): number {
    return this.reader.getBytePosition();
  }

  getFrameSize(): number {
    return this.reader.getFrameSize();
  }

  getSource(): TypedArray {
    return this.reader.getSource();
  }

  write(value: number, bitCount: number): void {
    this.writer.write(value, bitCount);
    this.reader.setPosition(this.writer.getPosition());
  }

  read(bitCount: number): number {
    const value = this.reader.read(bitCount);
    this.writer.setPosition(this.reader.getPosition());
    return value;
  }
}
