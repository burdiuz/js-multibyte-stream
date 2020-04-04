'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const MASK_MAX_INDEX = 31;
const MASKS = ((index) => {
    const list = [0];
    while (index > 0) {
        list[index] = Math.pow(2, index) - 1;
        index--;
    }
    return list;
})(MASK_MAX_INDEX);
const getMaskOfLength = (length) => MASKS[length];

class DataSource {
    constructor(source = new Uint8Array(0xff)) {
        this.position = 0;
        this.source = source;
    }
    getPosition() {
        return this.position;
    }
    setPosition(value) {
        this.position = value;
    }
    getFrameSize() {
        return this.source.BYTES_PER_ELEMENT;
    }
    getCurrentFrame() {
        return this.getFrame(this.position);
    }
    setCurrentFrame(value) {
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
    getFrame(index) {
        return this.source[index];
    }
    setFrame(value, index) {
        this.source[index] = value;
    }
    getLength() {
        return this.source.length;
    }
    setLength(length) {
        const values = this.source;
        this.source = new values.constructor(length);
        this.source.set(values);
    }
    getSource() {
        return this.source;
    }
}
class DynamicDataSource extends DataSource {
    setPosition(value) {
        super.setPosition(value);
        this.validateLength();
    }
    validateLength() {
        const { position, source: { length } } = this;
        if (position >= length - 1) {
            this.setLength(Math.ceil(Math.max(length, position) << 1));
        }
    }
}

var Endian;
(function (Endian) {
    Endian[Endian["BIG"] = 1] = "BIG";
    Endian[Endian["LITTLE"] = 0] = "LITTLE";
})(Endian || (Endian = {}));

class BaseBitRW {
    constructor() {
        this.endian = Endian.BIG;
        this.framePosition = 0;
    }
    setData(data) {
        this.source = new DataSource(data);
    }
    setSource(source) {
        this.source = source;
    }
    getBitOrder() {
        return this.endian;
    }
    setBitOrder(value) {
        this.endian = value;
    }
    getPosition() {
        return this.source.getPosition() * this.getFrameSize() + this.framePosition;
    }
    setPosition(value) {
        const frameSize = this.getFrameSize();
        this.source.setPosition((value / frameSize) | 0);
        this.framePosition = value % frameSize;
    }
    getBytePosition() {
        const frameSize = this.getFrameSize();
        return (this.source.getPosition() * (frameSize / 8) +
            Math.ceil(this.framePosition / 8));
    }
    getFrameSize() {
        return this.source.getFrameSize();
    }
    getSource() {
        return this.source.getSource();
    }
}

const reverseBitOrder = (value, length) => {
    let pos = length - 1;
    let result = 0;
    while (pos >= 0) {
        result = (result << 1) | (value >> pos);
        pos--;
    }
    return result;
};

class BitReader extends BaseBitRW {
    setData(data) {
        this.source = new DataSource(data);
    }
    setSource(source) {
        this.source = source;
    }
    read(size) {
        const frameSize = this.getFrameSize();
        let value = 0;
        let leftSize = size;
        let leftSpace = frameSize - this.framePosition;
        while (leftSize > 0) {
            let shiftSize = leftSize;
            if (shiftSize > leftSpace) {
                shiftSize = leftSpace;
            }
            let currentFrame = this.source.getCurrentFrame();
            value =
                (value << shiftSize) |
                    ((currentFrame >> (leftSpace - shiftSize)) &
                        getMaskOfLength(shiftSize));
            leftSpace -= shiftSize;
            leftSize -= shiftSize;
            if (!leftSpace) {
                this.source.nextFrame();
                leftSpace = frameSize;
            }
        }
        if (this.endian === Endian.LITTLE) {
            value = reverseBitOrder(value, size);
        }
        this.framePosition = frameSize - leftSpace;
        return value;
    }
    readBit() {
        return this.read(1);
    }
    readUByte() {
        return this.read(8);
    }
    readUShort() {
        return this.read(16);
    }
    readUInt() {
        return this.read(32);
    }
}

const getSliceOf = (value, position, size) => (value >> position) & getMaskOfLength(size);

const createWritableSource = (data) => new DynamicDataSource(data || new Uint8Array(0xff));
class BitWriter extends BaseBitRW {
    setData(data) {
        this.source = new DynamicDataSource(data);
    }
    setSource(source) {
        this.source = source;
    }
    write(data, size, position = 0) {
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
            if (!leftSpace) {
                this.source.nextFrame();
                leftSpace = frameSize;
            }
        }
        this.framePosition = frameSize - leftSpace;
    }
    writeBit(value) {
        return this.write(value | 0, 1);
    }
    writeUByte(value) {
        return this.write(value | 0, 8);
    }
    writeUShort(value) {
        return this.write(value | 0, 16);
    }
    writeUInt(value) {
        return this.write(value | 0, 32);
    }
}

class BitStream {
    constructor(data) {
        this.writer = new BitWriter();
        this.reader = new BitReader();
        if (data !== undefined) {
            this.setData(data);
        }
    }
    setData(data) {
        const source = createWritableSource(data);
        this.setSource(source);
    }
    setSource(source) {
        this.writer.setSource(source);
        this.reader.setSource(source);
    }
    getBitOrder() {
        return this.reader.getBitOrder();
    }
    setBitOrder(value) {
        this.writer.setBitOrder(value);
        this.reader.setBitOrder(value);
    }
    getPosition() {
        return this.reader.getPosition();
    }
    setPosition(value) {
        this.writer.setPosition(value);
        this.reader.setPosition(value);
    }
    getBytePosition() {
        return this.reader.getBytePosition();
    }
    getFrameSize() {
        return this.reader.getFrameSize();
    }
    getSource() {
        return this.reader.getSource();
    }
    write(value, bitCount) {
        this.writer.write(value, bitCount);
        this.reader.setPosition(this.writer.getPosition());
    }
    read(bitCount) {
        const value = this.reader.read(bitCount);
        this.writer.setPosition(this.reader.getPosition());
        return value;
    }
}

exports.BitReader = BitReader;
exports.BitStream = BitStream;
exports.BitWriter = BitWriter;
exports.createWritableSource = createWritableSource;
