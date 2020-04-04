import { DataSource } from './datasource';
import { IDataSource, TypedArray } from './idatasource';
import { IBaseBitRW } from './ibitstream';
import { Endian } from '../../endian';

export class BaseBitRW implements Partial<IBaseBitRW> {
  protected endian = Endian.BIG;
  protected framePosition = 0;
  protected source: IDataSource;

  setData(data: TypedArray): void {
    this.source = new DataSource(data);
  }

  setSource(source: IDataSource): void {
    this.source = source;
  }

  getBitOrder() {
    return this.endian;
  }

  setBitOrder(value: Endian) {
    this.endian = value;
  }

  getPosition() {
    return this.source.getPosition() * this.getFrameSize() + this.framePosition;
  }

  setPosition(value: number) {
    const frameSize = this.getFrameSize();

    this.source.setPosition((value / frameSize) | 0);
    this.framePosition = value % frameSize;
  }

  getBytePosition() {
    const frameSize = this.getFrameSize();

    return (
      this.source.getPosition() * (frameSize / 8) +
      Math.ceil(this.framePosition / 8)
    );
  }

  getFrameSize() {
    return this.source.getFrameSize();
  }

  getSource(): TypedArray {
    return this.source.getSource();
  }
}
