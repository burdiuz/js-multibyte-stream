import { describe, it, expect, beforeEach } from '@jest/globals';
import '../index'; // populate defaultTypeRegistry via side-effects
import {
  TypeRegistry,
  defaultTypeRegistry,
  addTypeDefinitionFor,
  hasTypeDefinitionFor,
  getTypeDefinitionFor,
  getValueTypeDefinition,
} from '../registry';
import { BoolType } from '../bool';
import { IntType } from '../int';
import { StringType } from '../string';

describe('TypeRegistry', () => {
  let registry: TypeRegistry;

  beforeEach(() => {
    registry = new TypeRegistry();
  });

  describe('#add()', () => {
    it('should register a type by all its keys', () => {
      registry.add(BoolType);
      expect(registry.hasTypeFor('bool')).toBe(true);
      expect(registry.hasTypeFor(Boolean)).toBe(true);
      expect(registry.hasTypeFor(BoolType)).toBe(true);
    });
  });

  describe('#addTypeFor()', () => {
    it('should register a type under a custom key', () => {
      registry.addTypeFor('myBool', BoolType);
      expect(registry.hasTypeFor('myBool')).toBe(true);
    });
  });

  describe('#hasTypeFor()', () => {
    it('should return false for unregistered key', () => {
      expect(registry.hasTypeFor('nonexistent')).toBe(false);
    });

    it('should return true after registering', () => {
      registry.add(IntType);
      expect(registry.hasTypeFor(Number)).toBe(true);
    });
  });

  describe('#getTypeFor()', () => {
    it('should return the registered type', () => {
      registry.add(BoolType);
      expect(registry.getTypeFor('bool')).toBe(BoolType);
    });

    it('should return undefined for unregistered key', () => {
      expect(registry.getTypeFor('unknown')).toBeUndefined();
    });
  });

  describe('#fromObject()', () => {
    it('should instantiate type from serialised descriptor', () => {
      registry.add(BoolType);
      const instance = registry.fromObject({ type: 'bool' });
      expect(instance).toBeInstanceOf(BoolType);
    });

    it('should throw for unknown type', () => {
      expect(() => registry.fromObject({ type: 'unknown' })).toThrow(
        'Data type "unknown" cannot be found'
      );
    });
  });
});

describe('defaultTypeRegistry', () => {
  it('should have bool registered', () => {
    expect(defaultTypeRegistry.hasTypeFor('bool')).toBe(true);
  });

  it('should have int registered', () => {
    expect(defaultTypeRegistry.hasTypeFor('int')).toBe(true);
  });

  it('should have string registered', () => {
    expect(defaultTypeRegistry.hasTypeFor('string')).toBe(true);
  });

  it('should have array registered', () => {
    expect(defaultTypeRegistry.hasTypeFor('array')).toBe(true);
  });

  it('should have object registered', () => {
    expect(defaultTypeRegistry.hasTypeFor('object')).toBe(true);
  });

  it('should have bigint registered', () => {
    expect(defaultTypeRegistry.hasTypeFor('bigint')).toBe(true);
  });
});

describe('module-level helpers', () => {
  it('addTypeDefinitionFor / hasTypeDefinitionFor / getTypeDefinitionFor', () => {
    addTypeDefinitionFor('testKey', StringType);
    expect(hasTypeDefinitionFor('testKey')).toBe(true);
    expect(getTypeDefinitionFor('testKey')).toBe(StringType);
  });

  it('getValueTypeDefinition should look up by constructor', () => {
    expect(getValueTypeDefinition(true)).toBe(
      defaultTypeRegistry.getTypeFor(Boolean)
    );
    expect(getValueTypeDefinition(42)).toBe(
      defaultTypeRegistry.getTypeFor(Number)
    );
    expect(getValueTypeDefinition('str')).toBe(
      defaultTypeRegistry.getTypeFor(String)
    );
  });
});
