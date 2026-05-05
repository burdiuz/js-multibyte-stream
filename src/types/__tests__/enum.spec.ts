import { describe, it, expect, beforeEach } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import { EnumType } from '../enum';

const roundTrip = (type: EnumType, value: any): any => {
  const stream = new BitStream();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('EnumType', () => {
  const values = ['red', 'green', 'blue'];
  let type: EnumType;

  beforeEach(() => {
    type = new EnumType(values);
  });

  describe('#writeTo() / #readFrom()', () => {
    it('should round-trip first value', () => {
      expect(roundTrip(type, 'red')).toBe('red');
    });

    it('should round-trip middle value', () => {
      expect(roundTrip(type, 'green')).toBe('green');
    });

    it('should round-trip last value', () => {
      expect(roundTrip(type, 'blue')).toBe('blue');
    });
  });

  describe('#writeTo() error handling', () => {
    it('should throw for a value not in the enum', () => {
      expect(() => type.writeTo(new BitStream(), 'yellow')).toThrow(
        'Value "yellow" is not part of enumeration.'
      );
    });
  });

  describe('with numeric values', () => {
    it('should round-trip numeric enum members', () => {
      const numType = new EnumType([10, 20, 30]);
      expect(roundTrip(numType, 20)).toBe(20);
    });
  });

  describe('#toObject()', () => {
    it('should serialise values array', () => {
      expect(type.toObject()).toEqual({ type: 'enum', values });
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include string key and class', () => {
      expect(EnumType.getTypeKeys()).toContain('enum');
      expect(EnumType.getTypeKeys()).toContain(EnumType);
    });

    it('#fromObject() should reconstruct from serialised form', () => {
      const obj = type.toObject() as any;
      const restored = EnumType.fromObject(obj);
      expect(roundTrip(restored, 'green')).toBe('green');
    });
  });
});
