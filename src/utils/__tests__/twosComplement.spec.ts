import { describe, it, expect } from '@jest/globals';
import {
  toTwosComplementRepresentation,
  fromTwosComplementRepresentation,
  getTwosComplementOf,
} from '../twosComplement';

describe('toTwosComplementRepresentation()', () => {
  it('should leave positive values unchanged (masked)', () => {
    expect(toTwosComplementRepresentation(0, 8)).toBe(0);
    expect(toTwosComplementRepresentation(1, 8)).toBe(1);
    expect(toTwosComplementRepresentation(127, 8)).toBe(127);
  });

  it('should encode -1 as all-ones within bit width', () => {
    expect(toTwosComplementRepresentation(-1, 8)).toBe(0xFF);
    expect(toTwosComplementRepresentation(-1, 4)).toBe(0xF);
  });

  it('should encode -5 in 8 bits as 251', () => {
    expect(toTwosComplementRepresentation(-5, 8)).toBe(251);
  });

  it('should encode -100 in 8 bits correctly', () => {
    expect(toTwosComplementRepresentation(-100, 8)).toBe(156);
  });
});

describe('fromTwosComplementRepresentation()', () => {
  it('should decode positive values', () => {
    expect(fromTwosComplementRepresentation(0, 8)).toBe(0);
    expect(fromTwosComplementRepresentation(1, 8)).toBe(1);
    expect(fromTwosComplementRepresentation(127, 8)).toBe(127);
  });

  it('should decode 0xFF as -1 in 8 bits', () => {
    expect(fromTwosComplementRepresentation(0xFF, 8)).toBe(-1);
  });

  it('should decode 251 as -5 in 8 bits', () => {
    expect(fromTwosComplementRepresentation(251, 8)).toBe(-5);
  });

  it('should round-trip values via to/from', () => {
    for (const v of [-127, -50, -1, 0, 1, 50, 127]) {
      expect(
        fromTwosComplementRepresentation(
          toTwosComplementRepresentation(v, 8),
          8
        )
      ).toBe(v);
    }
  });
});

describe('getTwosComplementOf()', () => {
  it('should return bit-inverted + 1 form', () => {
    expect(getTwosComplementOf(5, 8)).toBe(251);
    expect(getTwosComplementOf(1, 8)).toBe(255);
  });
});
