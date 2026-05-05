import { describe, it, expect, beforeEach } from '@jest/globals';
import { IBitWriter } from '../ibitstream';
import { copyWriterConfig } from '../bitwriter';
import { Endian } from '../../endian';
import { BitWriter } from '../bitwriter';

describe('BitWriter', () => {
  let writer: BitWriter;

  beforeEach(() => {
    writer = new BitWriter();
  });

  describe('When used 8 bit frames', () => {
    beforeEach(() => {
      writer.setData(new Uint8Array(2));
    });

    it('should create 8 bit frames data source', () => {
      expect(writer.getData().BYTES_PER_ELEMENT).toBe(1);
      expect(writer.getData().length).toBe(2);
    });

    describe('When changing endianness', () => {
      beforeEach(() => {
        writer.write(0b0101, 4);
        writer.setBitOrder(Endian.LITTLE);
        writer.write(0b1010, 8);
        writer.setBitOrder(Endian.BIG);
        writer.writeUInt(1);
        writer.setBitOrder(Endian.LITTLE);
        writer.writeUInt(1);
      });

      it('should properly write data between frames', () => {
        expect(writer.getSource().toString(0, 6)).toBe(
          '01010101 00000000 00000000 00000000 00000000 00011000'
        );
      });
    });

    describe('When writing typed array', () => {
      beforeEach(() => {
        writer.write(0, 4);
        writer.writeData(Uint8Array.from([0b10101010, 0b01010101]));
        writer.writeData(Uint16Array.from([0b1010101001010101]), 4, 8);
      });

      it('should properly write data between frames', () => {
        expect(writer.getSource().toString(0, 4)).toBe(
          '00001010 10100101 01011010 01010000'
        );
      });
    });
  });

  describe('When data is undefined', () => {
    beforeEach(() => {
      writer.setData();
    });

    it('should create 8 bit frames data source', () => {
      expect(writer.getData().BYTES_PER_ELEMENT).toBe(1);
      expect(writer.getData().length).toBe(255);
    });
  });

  describe('When used 32 bit frames', () => {
    beforeEach(() => {
      writer.setData(new Uint32Array(2));
    });

    it('should create 32 bit frames data source', () => {
      expect(writer.getData().BYTES_PER_ELEMENT).toBe(4);
      expect(writer.getData().length).toBe(2);
    });

    describe('When writing data', () => {
      beforeEach(() => {
        writer.setPosition(8);
        writer.write(0b1110001101011010, 16);
        writer.writeUByte(2);
        writer.write(1, 16);
        writer.writeUShort(1);
        writer.writeUShort(1);
        writer.write(1, 16);
      });

      it('should properly write data between frames', () => {
        expect(writer.getSource().toString(0, 4)).toBe(
          '00000000111000110101101000000010 00000000000000010000000000000001 00000000000000010000000000000001 00000000000000000000000000000000'
        );
      });
    });
  });

  describe('#writeBit()', () => {
    it('should write a single bit', () => {
      writer.setData(new Uint8Array(4));
      writer.writeBit(1);
      writer.writeBit(0);
      writer.writeBit(1);
      expect(writer.getSource().toString(0, 1)).toBe('10100000');
    });
  });

  describe('#writeUByte()', () => {
    it('should write 8 bits', () => {
      writer.setData(new Uint8Array(4));
      writer.writeUByte(0b11001100);
      expect(writer.getSource().toString(0, 1)).toBe('11001100');
    });
  });

  describe('#writeUShort()', () => {
    it('should write 16 bits', () => {
      writer.setData(new Uint8Array(4));
      writer.writeUShort(0b1010101001010101);
      expect(writer.getSource().toString(0, 2)).toBe('10101010 01010101');
    });
  });
});

describe('copyWriterConfig()', () => {
  let writer: BitWriter;
  let copy: IBitWriter;

  beforeEach(() => {
    writer = new BitWriter();
    writer.setData(new Uint32Array(1));
    writer.setBitOrder(Endian.LITTLE);

    copy = copyWriterConfig(writer);
  });

  it('should copy bit order', () => {
    expect(copy.getBitOrder()).toBe(Endian.LITTLE);
  });

  it('should use same typed array type', () => {
    expect(copy.getData()).toBeInstanceOf(Uint32Array);
  });

  it('should use default length', () => {
    expect(copy.getData().length).toBe(255);
  });
});
