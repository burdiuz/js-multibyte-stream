import { describe, it, expect } from '@jest/globals';
import '../index'; // populate defaultTypeRegistry via side-effects
import { BitStream } from '../../stream/bitstream';
import { ArrayType } from '../array';
import { IntType } from '../int';
import { BoolType } from '../bool';

const roundTrip = (type: ArrayType, value: any[]): any[] => {
  const stream = new BitStream();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('ArrayType', () => {
  describe('array of integers (default element type)', () => {
    const type = new ArrayType(new IntType(false, 8));

    it('should round-trip a simple array', () => {
      expect(roundTrip(type, [1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should round-trip an empty array', () => {
      expect(roundTrip(type, [])).toEqual([]);
    });

    it('should round-trip a single-element array', () => {
      expect(roundTrip(type, [42])).toEqual([42]);
    });

    it('should round-trip a longer array', () => {
      expect(roundTrip(type, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0])).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
      ]);
    });
  });

  describe('array of booleans', () => {
    const type = new ArrayType(new BoolType());

    it('should round-trip boolean array', () => {
      expect(roundTrip(type, [true, false, true])).toEqual([true, false, true]);
    });
  });

  describe('nested arrays', () => {
    const type = new ArrayType(new ArrayType(new IntType(false, 8)));

    it('should round-trip nested arrays', () => {
      expect(roundTrip(type, [[1, 2], [3, 4]])).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('#toObject()', () => {
    it('should serialise element type', () => {
      const type = new ArrayType(new BoolType());
      const obj = type.toObject();
      expect(obj.type).toBe('array');
      expect((obj.elementsOfType as any).type).toBe('bool');
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include Array and class', () => {
      expect(ArrayType.getTypeKeys()).toContain(Array);
      expect(ArrayType.getTypeKeys()).toContain(ArrayType);
    });

    it('#fromObject() should reconstruct from serialised form', () => {
      const type = new ArrayType(new IntType(false, 8));
      const obj = type.toObject();
      const restored = ArrayType.fromObject(obj);
      expect(roundTrip(restored, [10, 20, 30])).toEqual([10, 20, 30]);
    });

    it('#getInstanceFor() should return null for empty array', () => {
      expect(ArrayType.getInstanceFor(undefined, [])).toBeNull();
    });
  });
});
