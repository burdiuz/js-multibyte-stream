import { describe, it, expect } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import { BoolType } from '../bool';

const roundTrip = (value: boolean): boolean => {
  const stream = new BitStream();
  const type = new BoolType();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('BoolType', () => {
  describe('#writeTo() / #readFrom()', () => {
    it('should round-trip true', () => {
      expect(roundTrip(true)).toBe(true);
    });

    it('should round-trip false', () => {
      expect(roundTrip(false)).toBe(false);
    });

    it('should use exactly 1 bit', () => {
      const stream = new BitStream();
      const type = new BoolType();
      type.writeTo(stream, true);
      expect(stream.getPosition()).toBe(1);
    });
  });

  describe('#toObject()', () => {
    it('should return type descriptor', () => {
      expect(new BoolType().toObject()).toEqual({ type: 'bool' });
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include string key, Boolean, and class', () => {
      expect(BoolType.getTypeKeys()).toEqual(['bool', Boolean, BoolType]);
    });

    it('#getInstance() should return a BoolType instance', () => {
      expect(BoolType.getInstance()).toBeInstanceOf(BoolType);
    });

    it('#getInstanceFor() should return a BoolType instance', () => {
      expect(BoolType.getInstanceFor()).toBeInstanceOf(BoolType);
    });

    it('#fromObject() should return a BoolType instance', () => {
      expect(BoolType.fromObject()).toBeInstanceOf(BoolType);
    });
  });
});
