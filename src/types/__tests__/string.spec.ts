import { describe, it, expect } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import { StringType } from '../string';

const roundTrip = (value: string): string => {
  const stream = new BitStream();
  const type = new StringType();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('StringType', () => {
  describe('#writeTo() / #readFrom()', () => {
    it('should round-trip an empty string', () => {
      expect(roundTrip('')).toBe('');
    });

    it('should round-trip a single character', () => {
      expect(roundTrip('a')).toBe('a');
    });

    it('should round-trip a short ASCII string', () => {
      expect(roundTrip('hello')).toBe('hello');
    });

    it('should round-trip a longer string', () => {
      expect(roundTrip('Hello, World!')).toBe('Hello, World!');
    });

    it('should round-trip digits and symbols', () => {
      expect(roundTrip('abc123!@#')).toBe('abc123!@#');
    });
  });

  describe('#toObject()', () => {
    it('should return type descriptor', () => {
      expect(new StringType().toObject()).toEqual({ type: 'string' });
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include String and class', () => {
      expect(StringType.getTypeKeys()).toContain(String);
      expect(StringType.getTypeKeys()).toContain(StringType);
    });

    it('#getInstance() should return StringType', () => {
      expect(StringType.getInstance()).toBeInstanceOf(StringType);
    });

    it('#fromObject() should return StringType', () => {
      expect(StringType.fromObject()).toBeInstanceOf(StringType);
    });
  });
});
