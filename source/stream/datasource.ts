import { IDataSource } from './idatasource';
import { TypedArray } from '../types';

export class DataSource implements IDataSource {
  protected source: TypedArray;
  protected position: number = 0;
  constructor(source: TypedArray = new Uint8Array(0xff)) {
    this.source = source;
  }

  getPosition() {
    return this.position;
  }

  setPosition(value: number) {
    this.position = value;
  }

  getFrameSize() {
    return this.source.BYTES_PER_ELEMENT;
  }

  getCurrentFrame() {
    return this.getFrame(this.position);
  }

  setCurrentFrame(value: number) {
    return this.setFrame(value, this.position);
  }

  nextFrame() {
    this.setPosition(this.isLastFrame() ? 0 : this.position + 1);
  }

  previousFrame() {
    this.setPosition(this.position > 0 ? this.position - 1 : 0);
  }

  isLastFrame() {
    return this.position === this.source.length - 1;
  }

  getFrame(index: number) {
    return this.source[index];
  }

  setFrame(value: number, index: number) {
    this.source[index] = value;
  }

  getLength() {
    return this.source.length;
  }

  setLength(length: number) {
    const values = this.source;
    this.source = new (values.constructor as any)(length);
    this.source.set(values);
  }

  getSource() {
    return this.source;
  }
}

export class DynamicDataSource extends DataSource {
  setPosition(value: number) {
    super.setPosition(value);
    this.validateLength();
  }

  validateLength() {
    const {
      position,
      source: { length }
    } = this;

    if (position >= length - 1) {
      this.setLength(Math.ceil(Math.max(length, position) << 1));
    }
  }
}
