import { describe, it, expect, beforeEach } from '@jest/globals';
import { BitReader } from '../bitreader';
import { Endian } from '../../endian';

describe('BitReader', () => {
  let reader: BitReader;

  beforeEach(() => {
    reader = new BitReader();
  });

  describe('When changing endianness', () => {
    beforeEach(() => {
      reader.setData(
        Uint8Array.from([
          0b01010101,
          0b00000000,
          0b00000000,
          0b00000000,
          0b00000000,
          0b00011000,
          0b00000000,
          0b00000000,
          0b00000000,
          0b00000000,
        ])
      );
    });

    it('should properly read data between frames', () => {
      expect(reader.read(4)).toBe(0b0101);
      reader.setBitOrder(Endian.LITTLE);
      expect(reader.read(8)).toBe(0b1010);
      reader.setBitOrder(Endian.BIG);
      expect(reader.read(32)).toBe(1);
      reader.setBitOrder(Endian.LITTLE);
      expect(reader.read(32)).toBe(1);
    });
  });

  describe('#readBit()', () => {
    beforeEach(() => {
      reader.setData(Uint8Array.from([0b10110000]));
    });

    it('should read single bits MSB first', () => {
      expect(reader.readBit()).toBe(1);
      expect(reader.readBit()).toBe(0);
      expect(reader.readBit()).toBe(1);
      expect(reader.readBit()).toBe(1);
    });
  });

  describe('#readUByte()', () => {
    it('should read 8 bits as unsigned byte', () => {
      reader.setData(Uint8Array.from([0b11001100]));
      expect(reader.readUByte()).toBe(0b11001100);
    });
  });

  describe('#readUShort()', () => {
    it('should read 16 bits as unsigned short', () => {
      reader.setData(Uint8Array.from([0b10101010, 0b01010101]));
      expect(reader.readUShort()).toBe(0b1010101001010101);
    });
  });

  describe('#readUInt()', () => {
    it('should read 32 bits as unsigned', () => {
      reader.setData(Uint8Array.from([0x01, 0x02, 0x03, 0x04]));
      expect(reader.readUInt()).toBe(0x01020304);
    });

    it('should return positive value when high bit is set', () => {
      reader.setData(Uint8Array.from([0xff, 0x00, 0xff, 0x00]));
      expect(reader.readUInt()).toBe(0xff00ff00);
    });
  });

  describe('#read() cross-frame', () => {
    it('should read bits spanning two frames', () => {
      reader.setData(Uint8Array.from([0b00001111, 0b11110000]));
      expect(reader.read(4)).toBe(0b0000);
      expect(reader.read(8)).toBe(0b11111111);
    });
  });

  describe('little endian', () => {
    it('should reverse bit order when reading', () => {
      reader.setData(Uint8Array.from([0b10000000]));
      reader.setBitOrder(Endian.LITTLE);
      expect(reader.read(8)).toBe(0b00000001);
    });
  });
});
