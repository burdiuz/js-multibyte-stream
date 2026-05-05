import { describe, it, expect } from '@jest/globals';
import { getBitCount, getBigIntBitCount } from '../getBitCount';

describe('getBitCount()', () => {
  it('should return 1 for 0', () => expect(getBitCount(0)).toBe(1));
  it('should return 1 for 1', () => expect(getBitCount(1)).toBe(1));
  it('should return 2 for 2', () => expect(getBitCount(2)).toBe(2));
  it('should return 3 for 3', () => expect(getBitCount(3)).toBe(3));
  it('should return 3 for 4', () => expect(getBitCount(4)).toBe(3));
  it('should return 4 for 7', () => expect(getBitCount(7)).toBe(4));
  it('should return 4 for 8', () => expect(getBitCount(8)).toBe(4));
  it('should return 8 for 127', () => expect(getBitCount(127)).toBe(8));
  it('should treat negative values like their absolute value', () => {
    expect(getBitCount(-1)).toBe(getBitCount(1));
    expect(getBitCount(-8)).toBe(getBitCount(8));
  });
});

describe('getBigIntBitCount()', () => {
  it('should return 1 for 0n', () => expect(getBigIntBitCount(0n)).toBe(1));
  it('should return 1 for 1n', () => expect(getBigIntBitCount(1n)).toBe(1));
  it('should return 2 for 2n', () => expect(getBigIntBitCount(2n)).toBe(2));
  it('should return 8 for 255n', () => expect(getBigIntBitCount(255n)).toBe(8));
  it('should return 9 for 256n', () => expect(getBigIntBitCount(256n)).toBe(9));
  it('should treat negative values like their absolute value', () => {
    expect(getBigIntBitCount(-1n)).toBe(getBigIntBitCount(1n));
  });
});
