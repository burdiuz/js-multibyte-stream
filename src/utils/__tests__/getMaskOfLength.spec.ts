import { describe, it, expect } from '@jest/globals';
import { getMaskOfLength, getBigIntMaskOfLength, MASKS, MAX_MASK } from '../getMaskOfLength';

describe('getMaskOfLength()', () => {
  it('should return 0 for length 0', () => expect(getMaskOfLength(0)).toBe(0));
  it('should return 1 for length 1', () => expect(getMaskOfLength(1)).toBe(0b1));
  it('should return 3 for length 2', () => expect(getMaskOfLength(2)).toBe(0b11));
  it('should return 7 for length 3', () => expect(getMaskOfLength(3)).toBe(0b111));
  it('should return 0xFF for length 8', () => expect(getMaskOfLength(8)).toBe(0xFF));
  it('should return 0xFFFF for length 16', () => expect(getMaskOfLength(16)).toBe(0xFFFF));
  it('should return 0xFFFFFFFF for length 32', () => expect(getMaskOfLength(32)).toBe(0xFFFFFFFF));
});

describe('getBigIntMaskOfLength()', () => {
  it('should return 0n for 0n', () => expect(getBigIntMaskOfLength(0n)).toBe(0n));
  it('should return 1n for 1n', () => expect(getBigIntMaskOfLength(1n)).toBe(1n));
  it('should return 255n for 8n', () => expect(getBigIntMaskOfLength(8n)).toBe(255n));
});

describe('MASKS', () => {
  it('should be pre-computed for lengths 0-32', () => {
    expect(MASKS[0]).toBe(0);
    expect(MASKS[8]).toBe(0xFF);
    expect(MASKS[32]).toBe(MAX_MASK);
  });
});
