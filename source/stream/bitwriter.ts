import { getMaskOfLength } from '../utils/getMaskOfLength';
import { reverseBitOrder } from '../utils/reverseBitOrder';
import { IBitWriter } from './ibitstream';
import { DynamicDataSource } from './datasource';
import { IDataSource } from './idatasource';
import { BaseBitRW } from './basebitrw';
import { getSliceOf } from '../utils/getSliceOf';
import { Endian } from '../endian';
import { TypedArray } from '../types';

export const createWritableSource = (data?: TypedArray) =>
  new DynamicDataSource(data || new Uint8Array(0xff));

export class BitWriter extends BaseBitRW implements IBitWriter {
  setData(data?: TypedArray): void {
    this.source = new DynamicDataSource(data || undefined);
  }

  setSource(source: IDataSource): void {
    this.source = source;
  }

  write(data: number, size: number, position = 0) {
    const frameSize = this.getFrameSize();
    let value = getSliceOf(data, position, size);

    if (this.endian === Endian.LITTLE) {
      value = reverseBitOrder(value, size);
    }

    let leftValue = value;
    let leftSize = size;
    let leftSpace = frameSize - this.framePosition;

    while (leftSize > 0) {
      let currentValue = leftValue;
      let currentSize = leftSize;

      if (leftSize > leftSpace) {
        currentSize = leftSpace;
        currentValue = currentValue >>> (leftSize - currentSize);
      }

      let currentFrame = this.source.getCurrentFrame();
      currentFrame = currentFrame | (currentValue << (leftSpace - currentSize));

      this.source.setCurrentFrame(currentFrame);

      leftSpace -= currentSize;
      leftSize -= currentSize;
      leftValue = leftValue & getMaskOfLength(leftSize);

      if (!leftSpace) {
        this.source.nextFrame();
        leftSpace = frameSize;
      }
    }

    this.framePosition = frameSize - leftSpace;
  }

  writeData(
    value: TypedArray,
    bitStart: number = 0,
    bitLength: number = value.length * (value.BYTES_PER_ELEMENT << 3) - bitStart
  ): void {
    const frameSize = value.BYTES_PER_ELEMENT << 3;
    const start = (bitStart / frameSize) | 0;
    let leftLength = bitLength;
    let index = start;

    while (leftLength > 0) {
      let size = frameSize;
      let source = value[index];

      if (index === start) {
        size = frameSize - (bitStart % frameSize);
        source = source & getMaskOfLength(size);
      }

      if (leftLength < size) {
        size = leftLength;
        source = (source >> (frameSize - size)) & getMaskOfLength(size);
      }

      this.write(source, size);
      leftLength -= size;
      index++;
    }
  }

  writeBit(value: number) {
    return this.write(value | 0, 1);
  }

  writeUByte(value: number) {
    return this.write(value | 0, 8);
  }

  writeUShort(value: number) {
    return this.write(value | 0, 16);
  }

  writeUInt(value: number) {
    return this.write(value | 0, 32);
  }
}

export const copyWriterConfig = (writer: IBitWriter): IBitWriter => {
  const copy = new BitWriter();
  const { constructor: TypedArrayDef } = Object.getPrototypeOf(
    writer.getData()
  );

  copy.setBitOrder(writer.getBitOrder());
  copy.setData(new TypedArrayDef(0xff));

  return copy;
};
