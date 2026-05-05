import { describe, it, expect, beforeEach } from '@jest/globals';
import { BitStream } from '../bitstream';
import { Endian } from '../../endian';

describe('BitStream', () => {
  let stream: BitStream;

  beforeEach(() => {
    stream = new BitStream();
  });

  describe('#write() and #read()', () => {
    it('should round-trip a 4-bit value', () => {
      stream.write(0b1010, 4);
      stream.setPosition(0);
      expect(stream.read(4)).toBe(0b1010);
    });

    it('should round-trip two consecutive values', () => {
      stream.write(0b10101010, 8);
      stream.write(0b11001100, 8);
      stream.setPosition(0);
      expect(stream.read(8)).toBe(0b10101010);
      expect(stream.read(8)).toBe(0b11001100);
    });

    it('should read across frame boundaries', () => {
      stream.write(0b1111, 4);
      stream.write(0b0000, 4);
      stream.write(0b1111, 4);
      stream.setPosition(0);
      expect(stream.read(12)).toBe(0b111100001111);
    });
  });

  describe('#setPosition()', () => {
    it('should allow re-reading from start', () => {
      stream.write(0b1111, 4);
      stream.write(0b0000, 4);
      stream.setPosition(0);
      expect(stream.read(4)).toBe(0b1111);
      expect(stream.read(4)).toBe(0b0000);
    });

    it('should overwrite bits including clearing set bits', () => {
      stream.write(0b1111, 4);
      stream.setPosition(0);
      stream.write(0b0101, 4);
      stream.setPosition(0);
      expect(stream.read(4)).toBe(0b0101);
    });
  });

  describe('#getPosition()', () => {
    it('should return 0 at start', () => {
      expect(stream.getPosition()).toBe(0);
    });

    it('should advance after writing', () => {
      stream.write(0b101, 3);
      expect(stream.getPosition()).toBe(3);
    });

    it('should advance after reading', () => {
      stream.write(0, 8);
      stream.setPosition(0);
      stream.read(5);
      expect(stream.getPosition()).toBe(5);
    });
  });

  describe('#getBytePosition()', () => {
    it('should return byte count written', () => {
      stream.write(0, 8);
      expect(stream.getBytePosition()).toBe(1);
    });

    it('should round partial bytes up', () => {
      stream.write(0, 12);
      expect(stream.getBytePosition()).toBe(2);
    });
  });

  describe('#getData()', () => {
    it('should return underlying typed array', () => {
      expect(stream.getData()).toBeInstanceOf(Uint8Array);
    });
  });

  describe('#setData()', () => {
    it('should initialise from existing data', () => {
      const s = new BitStream(Uint8Array.from([0b10101010]));
      expect(s.read(8)).toBe(0b10101010);
    });

    it('should share source between reader and writer', () => {
      stream.write(0b11110000, 8);
      stream.setPosition(0);
      expect(stream.read(8)).toBe(0b11110000);
    });
  });

  describe('#writeData()', () => {
    it('should write a full typed array', () => {
      stream.writeData(Uint8Array.from([0b10101010, 0b01010101]));
      stream.setPosition(0);
      expect(stream.read(8)).toBe(0b10101010);
      expect(stream.read(8)).toBe(0b01010101);
    });

    it('should write a slice of a typed array', () => {
      // low nibble of byte 0 (0b1111) + high nibble of byte 1 (0b1111) = 0b11111111
      stream.writeData(Uint8Array.from([0b00001111, 0b11110000]), 4, 8);
      stream.setPosition(0);
      expect(stream.read(8)).toBe(0b11111111);
    });
  });

  describe('#setBitOrder()', () => {
    it('should apply little-endian to both reader and writer', () => {
      stream.setBitOrder(Endian.LITTLE);
      stream.write(0b10000000, 8);
      stream.setPosition(0);
      expect(stream.read(8)).toBe(0b10000000);
    });

    it('should reflect bit order via #getBitOrder()', () => {
      stream.setBitOrder(Endian.LITTLE);
      expect(stream.getBitOrder()).toBe(Endian.LITTLE);
    });
  });

  describe('#getFrameSize()', () => {
    it('should return 8 for default Uint8 stream', () => {
      expect(stream.getFrameSize()).toBe(8);
    });
  });
});
