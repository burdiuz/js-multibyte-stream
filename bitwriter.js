class SimpleBitWriter extends AbstractBitInterface {
  constructor(source, position = undefined, frameSize = undefined) {
    super(source, position, frameSize);
  }

  write(value, count) {}

  writeBit(value) {
    return this.read(value | 0, 1);
  }

  write8Bits(value) {
    return this.read(value | 0, 8);
  }
}

class BitWriter extends SimpleBitWriter {}
