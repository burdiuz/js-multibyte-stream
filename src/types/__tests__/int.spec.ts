import { describe, it, expect } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import {
  IntType,
  ShortType,
  ByteType,
  UIntType,
  UShortType,
  UByteType,
} from '../int';

const roundTrip = (type: IntType, value: number): number => {
  const stream = new BitStream();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('IntType', () => {
  describe('variable-length signed (size=0)', () => {
    const type = new IntType(true, 0);

    it('should round-trip 0', () => expect(roundTrip(type, 0)).toBe(0));
    it('should round-trip 1', () => expect(roundTrip(type, 1)).toBe(1));
    it('should round-trip -1', () => expect(roundTrip(type, -1)).toBe(-1));
    it('should round-trip 127', () => expect(roundTrip(type, 127)).toBe(127));
    it('should round-trip -127', () => expect(roundTrip(type, -127)).toBe(-127));
    it('should round-trip 777', () => expect(roundTrip(type, 777)).toBe(777));
    it('should round-trip -777', () => expect(roundTrip(type, -777)).toBe(-777));
    it('should round-trip 65535', () => expect(roundTrip(type, 65535)).toBe(65535));
  });

  describe('variable-length unsigned (size=0)', () => {
    const type = new IntType(false, 0);

    it('should round-trip 0', () => expect(roundTrip(type, 0)).toBe(0));
    it('should round-trip 1', () => expect(roundTrip(type, 1)).toBe(1));
    it('should round-trip 255', () => expect(roundTrip(type, 255)).toBe(255));
    it('should round-trip 1000', () => expect(roundTrip(type, 1000)).toBe(1000));
  });

  describe('fixed-size signed 8-bit', () => {
    const type = new IntType(true, 8);

    it('should round-trip 0', () => expect(roundTrip(type, 0)).toBe(0));
    it('should round-trip 100', () => expect(roundTrip(type, 100)).toBe(100));
    it('should round-trip -100', () => expect(roundTrip(type, -100)).toBe(-100));
    it('should round-trip 127', () => expect(roundTrip(type, 127)).toBe(127));
    it('should round-trip -127', () => expect(roundTrip(type, -127)).toBe(-127));
  });

  describe('fixed-size unsigned 8-bit', () => {
    const type = new IntType(false, 8);

    it('should round-trip 0', () => expect(roundTrip(type, 0)).toBe(0));
    it('should round-trip 255', () => expect(roundTrip(type, 255)).toBe(255));
    it('should round-trip 200', () => expect(roundTrip(type, 200)).toBe(200));
  });

  describe('fixed-size signed 16-bit', () => {
    const type = new IntType(true, 16);

    it('should round-trip 10000', () => expect(roundTrip(type, 10000)).toBe(10000));
    it('should round-trip -10000', () => expect(roundTrip(type, -10000)).toBe(-10000));
  });

  describe('#toObject()', () => {
    it('should serialise type parameters', () => {
      const type = new IntType(true, 8);
      expect(type.toObject()).toEqual({
        type: 'int',
        signed: true,
        size: 8,
        twosComplement: true,
      });
    });
  });

  describe('#fromObject()', () => {
    it('should reconstruct from serialised form', () => {
      const type = IntType.fromObject({ type: 'int', signed: false, size: 16 });
      expect(roundTrip(type, 1000)).toBe(1000);
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include Number and class', () => {
      expect(IntType.getTypeKeys()).toContain(Number);
      expect(IntType.getTypeKeys()).toContain(IntType);
    });

    it('#getInstance() should return IntType', () => {
      expect(IntType.getInstance()).toBeInstanceOf(IntType);
    });
  });
});

describe('ShortType', () => {
  const type = new ShortType();

  it('should round-trip signed 16-bit values', () => {
    expect(roundTrip(type, 0)).toBe(0);
    expect(roundTrip(type, 32767)).toBe(32767);
    expect(roundTrip(type, -32767)).toBe(-32767);
  });

  it('#toObject() should return short descriptor', () => {
    expect(type.toObject()).toEqual({ type: 'short' });
  });

  it('#fromObject() should return ShortType', () => {
    expect(ShortType.fromObject()).toBeInstanceOf(ShortType);
  });
});

describe('ByteType', () => {
  const type = new ByteType();

  it('should round-trip signed 8-bit values', () => {
    expect(roundTrip(type, 0)).toBe(0);
    expect(roundTrip(type, 127)).toBe(127);
    expect(roundTrip(type, -127)).toBe(-127);
  });

  it('#toObject() should return byte descriptor', () => {
    expect(type.toObject()).toEqual({ type: 'byte' });
  });
});

describe('UIntType', () => {
  const type = new UIntType();

  it('should round-trip unsigned variable-length values', () => {
    expect(roundTrip(type, 0)).toBe(0);
    expect(roundTrip(type, 65535)).toBe(65535);
  });

  it('#toObject() should return uint descriptor', () => {
    expect(type.toObject()).toEqual({ type: 'uint' });
  });
});

describe('UShortType', () => {
  const type = new UShortType();

  it('should round-trip unsigned 16-bit values', () => {
    expect(roundTrip(type, 0)).toBe(0);
    expect(roundTrip(type, 65535)).toBe(65535);
  });
});

describe('UByteType', () => {
  const type = new UByteType();

  it('should round-trip unsigned 8-bit values', () => {
    expect(roundTrip(type, 0)).toBe(0);
    expect(roundTrip(type, 255)).toBe(255);
  });
});
