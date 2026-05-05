import { describe, it, expect } from '@jest/globals';
import {
  toOnesComplementRepresentation,
  fromOnesComplementRepresentation,
} from '../onesComplement';

describe('toOnesComplementRepresentation()', () => {
  it('should leave positive values unchanged (masked)', () => {
    expect(toOnesComplementRepresentation(0, 8)).toBe(0);
    expect(toOnesComplementRepresentation(1, 8)).toBe(1);
    expect(toOnesComplementRepresentation(127, 8)).toBe(127);
  });

  it('should encode -1 in 8 bits', () => {
    expect(toOnesComplementRepresentation(-1, 8)).toBe(0b10000001);
  });

  it('should encode -5 in 8 bits', () => {
    expect(toOnesComplementRepresentation(-5, 8)).toBe(0b10000101);
  });
});

describe('fromOnesComplementRepresentation()', () => {
  it('should decode positive values', () => {
    expect(fromOnesComplementRepresentation(0, 8)).toBe(0);
    expect(fromOnesComplementRepresentation(1, 8)).toBe(1);
  });

  it('should decode a negative ones-complement value', () => {
    expect(fromOnesComplementRepresentation(0b10000001, 8)).toBe(-1);
    expect(fromOnesComplementRepresentation(0b10000101, 8)).toBe(-5);
  });

  it('should round-trip values via to/from', () => {
    for (const v of [-127, -50, -5, -1, 0, 1, 50, 127]) {
      expect(
        fromOnesComplementRepresentation(
          toOnesComplementRepresentation(v, 8),
          8
        )
      ).toBe(v);
    }
  });
});
