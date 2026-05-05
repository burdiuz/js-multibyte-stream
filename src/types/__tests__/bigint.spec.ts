import { describe, it, expect } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import { BigIntType } from '../bigint';

const roundTrip = (value: bigint): bigint => {
  const stream = new BitStream();
  const type = new BigIntType();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('BigIntType', () => {
  describe('#writeTo() / #readFrom()', () => {
    it('should round-trip 0n', () => expect(roundTrip(0n)).toBe(0n));
    it('should round-trip 1n', () => expect(roundTrip(1n)).toBe(1n));
    it('should round-trip -1n', () => expect(roundTrip(-1n)).toBe(-1n));
    it('should round-trip 255n', () => expect(roundTrip(255n)).toBe(255n));
    it('should round-trip -255n', () => expect(roundTrip(-255n)).toBe(-255n));
    it('should round-trip large positive bigint', () => {
      const val = 555555555555555555555555555555555n;
      expect(roundTrip(val)).toBe(val);
    });
    it('should round-trip large negative bigint', () => {
      const val = -123456789012345678901234567890n;
      expect(roundTrip(val)).toBe(val);
    });
  });

  describe('#toObject()', () => {
    it('should return type descriptor', () => {
      expect(new BigIntType().toObject()).toEqual({ type: 'bigint' });
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include BigInt and class', () => {
      expect(BigIntType.getTypeKeys()).toContain(BigInt);
      expect(BigIntType.getTypeKeys()).toContain(BigIntType);
    });

    it('#getInstance() should return BigIntType', () => {
      expect(BigIntType.getInstance()).toBeInstanceOf(BigIntType);
    });

    it('#fromObject() should return BigIntType', () => {
      expect(BigIntType.fromObject()).toBeInstanceOf(BigIntType);
    });
  });
});
