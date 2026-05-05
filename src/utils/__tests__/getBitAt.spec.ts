import { describe, it, expect } from '@jest/globals';
import { getBitAt, getBigIntBitAt } from '../getBitAt';

describe('getBitAt()', () => {
  it('should return 0 for bit 0 of 0', () => expect(getBitAt(0, 0)).toBe(0));
  it('should return 1 for bit 0 of 1', () => expect(getBitAt(1, 0)).toBe(1));
  it('should return 0 for bit 1 of 1', () => expect(getBitAt(1, 1)).toBe(0));
  it('should return 1 for bit 7 of 0b10000000', () =>
    expect(getBitAt(0b10000000, 7)).toBe(1));
  it('should return 0 for bit 7 of 0b01111111', () =>
    expect(getBitAt(0b01111111, 7)).toBe(0));
  it('should use default position 0', () => expect(getBitAt(0b101)).toBe(1));
});

describe('getBigIntBitAt()', () => {
  it('should return 0n for bit 0n of 0n', () =>
    expect(getBigIntBitAt(0n, 0n)).toBe(0n));
  it('should return 1n for bit 0n of 1n', () =>
    expect(getBigIntBitAt(1n, 0n)).toBe(1n));
  it('should return 1n for high bit', () =>
    expect(getBigIntBitAt(0b10000000n, 7n)).toBe(1n));
});
