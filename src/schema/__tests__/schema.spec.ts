import { describe, it, expect } from '@jest/globals';
import { Schema, readSchemaFrom } from '../schema';
import { ObjectType } from '../../types/object';
import { BoolType } from '../../types/bool';
import { IntType } from '../../types/int';
import { ArrayType } from '../../types/array';
import { defaultTypeRegistry } from '../../types/registry';

const makeSchema = () =>
  new Schema(
    ObjectType.getInstance(defaultTypeRegistry, {
      active: new BoolType(),
      count: new IntType(false, 8),
    })
  );

describe('Schema', () => {
  describe('#saveDataFrom() / #loadDataTo()', () => {
    it('should round-trip a simple object to binary', () => {
      const schema = makeSchema();
      const original = { active: true, count: 42 };
      const data = schema.saveDataFrom(original);
      expect(data).toBeInstanceOf(Uint8Array);
      expect(schema.loadDataTo(data)).toEqual(original);
    });

    it('should round-trip false boolean', () => {
      const schema = makeSchema();
      const original = { active: false, count: 0 };
      expect(schema.loadDataTo(schema.saveDataFrom(original))).toEqual(original);
    });

    it('should merge into an existing target object', () => {
      const schema = makeSchema();
      const data = schema.saveDataFrom({ active: true, count: 7 });
      const target: any = { extra: 'preserved' };
      schema.loadDataTo(data, target);
      expect(target.active).toBe(true);
      expect(target.count).toBe(7);
      expect(target.extra).toBe('preserved');
    });
  });

  describe('#saveBase64From() / #loadBase64To()', () => {
    it('should round-trip via base64', () => {
      const schema = makeSchema();
      const original = { active: true, count: 99 };
      const encoded = schema.saveBase64From(original);
      expect(typeof encoded).toBe('string');
      expect(schema.loadBase64To(encoded)).toEqual(original);
    });
  });

  describe('#toObject()', () => {
    it('should serialise schema to plain object', () => {
      const schema = makeSchema();
      const obj = schema.toObject();
      expect(obj.type).toBe('object');
      expect(obj.fields).toBeDefined();
    });
  });

  describe('Schema.fromObject()', () => {
    it('should reconstruct schema from plain object', () => {
      const schema = makeSchema();
      const obj = schema.toObject();
      const restored = Schema.fromObject(obj);
      expect(restored.loadDataTo(schema.saveDataFrom({ active: false, count: 5 }))).toEqual({
        active: false,
        count: 5,
      });
    });
  });

  describe('readSchemaFrom()', () => {
    it('should infer schema from a sample object', () => {
      const sample = {
        flag: false,
        num: 7,
      };
      const schema = readSchemaFrom(sample);
      expect(schema).toBeInstanceOf(Schema);
      expect(
        schema.loadDataTo(schema.saveDataFrom({ flag: true, num: 3 }))
      ).toEqual({ flag: true, num: 3 });
    });

    it('should handle nested arrays', () => {
      const sample = {
        frames: [
          [[0, 1], [1, 0]],
        ],
      };
      const schema = new Schema(
        ObjectType.getInstance(defaultTypeRegistry, {
          frames: new ArrayType(
            new ArrayType(new ArrayType(new IntType(false, 1)))
          ),
        })
      );
      const data = schema.saveBase64From(sample);
      expect(schema.loadBase64To(data)).toEqual(sample);
    });
  });
});
