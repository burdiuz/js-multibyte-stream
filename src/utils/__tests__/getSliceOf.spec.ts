import { describe, it, expect } from '@jest/globals';
import { getSliceOf, getPartFrom, getByteFrom, toSlices } from '../getSliceOf';

describe('getSliceOf()', () => {
  it('should extract low bits', () => {
    expect(getSliceOf(0b11001100, 0, 4)).toBe(0b1100);
  });

  it('should extract high bits', () => {
    expect(getSliceOf(0b11001100, 4, 4)).toBe(0b1100);
  });

  it('should extract middle bits', () => {
    expect(getSliceOf(0b11110000, 2, 4)).toBe(0b1100);
  });

  it('should return 0 when extracting 0 bits', () => {
    expect(getSliceOf(0xFF, 0, 0)).toBe(0);
  });
});

describe('getPartFrom()', () => {
  it('should extract byte-sized parts', () => {
    expect(getPartFrom(0xABCD, 8, 0)).toBe(0xCD);
    expect(getPartFrom(0xABCD, 8, 1)).toBe(0xAB);
  });
});

describe('getByteFrom()', () => {
  it('should extract bytes by index', () => {
    expect(getByteFrom(0xAABBCCDD, 0)).toBe(0xDD);
    expect(getByteFrom(0xAABBCCDD, 1)).toBe(0xCC);
  });
});

describe('toSlices()', () => {
  it('should split a value into consecutive slices', () => {
    expect(toSlices(0b11001010, 2, 2, 4)).toEqual([0b10, 0b10, 0b1100]);
  });

  it('should return one slice when given one size', () => {
    expect(toSlices(0b1010, 4)).toEqual([0b1010]);
  });
});
