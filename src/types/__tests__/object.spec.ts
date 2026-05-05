import { describe, it, expect, beforeEach } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import { ObjectType } from '../object';
import { BoolType } from '../bool';
import { IntType } from '../int';
import { defaultTypeRegistry } from '../registry';

const roundTrip = (type: ObjectType, value: object): object => {
  const stream = new BitStream();
  type.writeTo(stream, value);
  stream.setPosition(0);
  return type.readFrom(stream);
};

describe('ObjectType', () => {
  describe('with explicit schema', () => {
    let type: ObjectType;

    beforeEach(() => {
      type = ObjectType.getInstance(defaultTypeRegistry, {
        active: new BoolType(),
        count: new IntType(false, 8),
      });
    });

    it('should round-trip an object matching the schema', () => {
      expect(roundTrip(type, { active: true, count: 42 })).toEqual({
        active: true,
        count: 42,
      });
    });

    it('should round-trip with false boolean', () => {
      expect(roundTrip(type, { active: false, count: 0 })).toEqual({
        active: false,
        count: 0,
      });
    });
  });

  describe('with auto-inferred schema', () => {
    it('should infer schema from sample object on first write', () => {
      const type = new ObjectType();
      const sample = { flag: true, value: 7 };

      const stream = new BitStream();
      type.writeTo(stream, sample);
      stream.setPosition(0);
      const result = type.readFrom(stream);

      expect(result.flag).toBe(true);
      expect(result.value).toBe(7);
    });
  });

  describe('#readFrom() without schema', () => {
    it('should throw when no schema is defined', () => {
      const type = new ObjectType();
      expect(() => type.readFrom(new BitStream())).toThrow(
        'Object data could not be read since its schema is undefined.'
      );
    });
  });

  describe('nested objects', () => {
    it('should round-trip nested object structures', () => {
      const inner = ObjectType.getInstance(defaultTypeRegistry, {
        x: new IntType(false, 8),
        y: new IntType(false, 8),
      });
      const outer = ObjectType.getInstance(defaultTypeRegistry, {
        point: inner,
        active: new BoolType(),
      });

      expect(roundTrip(outer, { point: { x: 10, y: 20 }, active: true })).toEqual({
        point: { x: 10, y: 20 },
        active: true,
      });
    });
  });

  describe('#toObject() / #fromObject()', () => {
    it('should serialise and restore from object descriptor', () => {
      const type = ObjectType.getInstance(defaultTypeRegistry, {
        flag: new BoolType(),
      });
      const obj = type.toObject();
      const restored = ObjectType.fromObject(obj);
      expect(roundTrip(restored, { flag: false })).toEqual({ flag: false });
    });
  });

  describe('field order', () => {
    it('should sort fields alphabetically regardless of insertion order', () => {
      const type = ObjectType.getInstance(defaultTypeRegistry, {
        z: new BoolType(),
        a: new BoolType(),
        m: new BoolType(),
      });

      const stream = new BitStream();
      type.writeTo(stream, { z: true, a: false, m: true });
      stream.setPosition(0);
      const result = type.readFrom(stream);

      expect(result).toEqual({ z: true, a: false, m: true });
    });

    it('#setFieldOrder() should override alphabetical order', () => {
      const writer = ObjectType.getInstance(defaultTypeRegistry, {
        z: new BoolType(),
        a: new BoolType(),
        m: new BoolType(),
      });
      const reader = ObjectType.getInstance(defaultTypeRegistry, {
        z: new BoolType(),
        a: new BoolType(),
        m: new BoolType(),
      });

      // Write in explicit order z, m, a (not alphabetical a, m, z)
      writer.setFieldOrder(['z', 'm', 'a']);
      reader.setFieldOrder(['z', 'm', 'a']);

      const stream = new BitStream();
      writer.writeTo(stream, { z: true, a: false, m: true });
      stream.setPosition(0);
      const result = reader.readFrom(stream);

      expect(result).toEqual({ z: true, a: false, m: true });
    });
  });

  describe('static methods', () => {
    it('#getTypeKeys() should include Object and class', () => {
      expect(ObjectType.getTypeKeys()).toContain(Object);
      expect(ObjectType.getTypeKeys()).toContain(ObjectType);
    });
  });
});
