import { describe, it, expect } from '@jest/globals';
import { reverseBitOrder } from '../reverseBitOrder';

describe('reverseBitOrder()', () => {
  it('should reverse a single bit (no change)', () => {
    expect(reverseBitOrder(0b1, 1)).toBe(0b1);
    expect(reverseBitOrder(0b0, 1)).toBe(0b0);
  });

  it('should reverse 2 bits', () => {
    expect(reverseBitOrder(0b10, 2)).toBe(0b01);
    expect(reverseBitOrder(0b01, 2)).toBe(0b10);
  });

  it('should reverse 8 bits', () => {
    expect(reverseBitOrder(0b10000000, 8)).toBe(0b00000001);
    expect(reverseBitOrder(0b11001100, 8)).toBe(0b00110011);
    expect(reverseBitOrder(0b10101010, 8)).toBe(0b01010101);
  });

  it('should reverse 4 bits', () => {
    expect(reverseBitOrder(0b1010, 4)).toBe(0b0101);
    expect(reverseBitOrder(0b1111, 4)).toBe(0b1111);
    expect(reverseBitOrder(0b0001, 4)).toBe(0b1000);
  });

  it('should be its own inverse', () => {
    const value = 0b10110100;
    expect(reverseBitOrder(reverseBitOrder(value, 8), 8)).toBe(value);
  });
});
