import { describe, it, expect } from '@jest/globals';
import { BitStream } from '../../stream/bitstream';
import {
  readShortLength,
  writeShortLength,
  readUIntLength,
  writeUIntLength,
} from '../lengths';

const shortRoundTrip = (value: number): number => {
  const stream = new BitStream();
  writeShortLength(stream, value);
  stream.setPosition(0);
  return readShortLength(stream);
};

const uintRoundTrip = (value: number): number => {
  const stream = new BitStream();
  writeUIntLength(stream, value);
  stream.setPosition(0);
  return readUIntLength(stream);
};

describe('writeShortLength / readShortLength', () => {
  it('should round-trip 0', () => expect(shortRoundTrip(0)).toBe(0));
  it('should round-trip 1', () => expect(shortRoundTrip(1)).toBe(1));
  it('should round-trip 5', () => expect(shortRoundTrip(5)).toBe(5));
  it('should round-trip 15', () => expect(shortRoundTrip(15)).toBe(15));
  it('should round-trip 255', () => expect(shortRoundTrip(255)).toBe(255));
});

describe('writeUIntLength / readUIntLength', () => {
  it('should round-trip 0', () => expect(uintRoundTrip(0)).toBe(0));
  it('should round-trip 1', () => expect(uintRoundTrip(1)).toBe(1));
  it('should round-trip 1000', () => expect(uintRoundTrip(1000)).toBe(1000));
});
