class SimpleBitReader extends AbstractBitInterface {
  constructor(source, position = undefined, frameSize = undefined) {
    super(source, position, frameSize);
  }

  read(count) {
    const { position, frameSize } = this;
    let index = (position / frameSize) | 0;
    let pos = position % frameSize;

    
  }

  readBit() {
    return this.read(1);
  }

  read8Bits() {
    return this.read(8);
  }
}

class BitReader extends SimpleBitReader {}
