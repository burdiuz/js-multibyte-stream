import { describe, it, expect } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import { SimpleFloatType } from '../simplefloattype';

const roundTrip = (type: SimpleFloatType, value: number): number => {
  const stream = new BitStream();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('SimpleFloatType', () => {
  describe('default (3 fraction digits, signed, variable-length)', () => {
    const type = new SimpleFloatType();

    it('should round-trip 0', () => expect(roundTrip(type, 0)).toBe(0));
    it('should round-trip 1.5', () => expect(roundTrip(type, 1.5)).toBe(1.5));
    it('should round-trip -1.5', () => expect(roundTrip(type, -1.5)).toBe(-1.5));
    it('should round-trip 123.456', () =>
      expect(roundTrip(type, 123.456)).toBeCloseTo(123.456, 3));
    it('should round-trip -99.999', () =>
      expect(roundTrip(type, -99.999)).toBeCloseTo(-99.999, 3));
  });

  describe('2 fraction digits', () => {
    const type = new SimpleFloatType(true, 2);

    it('should round-trip 3.14 to 2 decimal places', () =>
      expect(roundTrip(type, 3.14)).toBeCloseTo(3.14, 2));
  });

  describe('#toObject()', () => {
    it('should serialise fraction digits and size', () => {
      const type = new SimpleFloatType(true, 3, 0);
      const obj = type.toObject();
      expect(obj.type).toBe('sfloat');
      expect(obj.fractionDigits).toBe(3);
      expect(obj.signed).toBe(true);
    });
  });

  describe('#fromObject()', () => {
    it('should reconstruct from serialised form', () => {
      const original = new SimpleFloatType(true, 2);
      const obj = original.toObject();
      const restored = SimpleFloatType.fromObject(obj);
      expect(roundTrip(restored as SimpleFloatType, 3.14)).toBeCloseTo(3.14, 2);
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include class', () => {
      expect(SimpleFloatType.getTypeKeys()).toContain(SimpleFloatType);
    });

    it('#getInstance() should return SimpleFloatType', () => {
      expect(SimpleFloatType.getInstance()).toBeInstanceOf(SimpleFloatType);
    });
  });
});
