class AbstractBitInterface {
  endian = Endian.BIG;
  position = 0;
  frameSize = 0;
  source = null;

  constructor(source, position = 0, frameSize = 8) {
    this.source = source;
    this.position = position;
    this.frameSize = frameSize;
  }

  getBitOrder() {
    return this.endian;
  }

  setBitOrder(value) {
    return this.endian = value;
  }

  getPosition() {
    return this.position;
  }

  setPosition(index) {
    this.position = index;
  }

  getFrameSize() {
    return this.frameSize;
  }

  getSource() {
    return this.source;
  }
}
