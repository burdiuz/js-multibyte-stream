import { describe, it, expect, beforeEach } from '@jest/globals';
import { TypedArray } from '../../types';
import { DataSource, DynamicDataSource } from '../datasource';

describe('DataSource', () => {
  let data: TypedArray;
  let source: DataSource;

  beforeEach(() => {
    data = Uint8Array.from([0b10111011, 0b00100010]);
    source = new DataSource(data);
  });

  describe('#getPosition()', () => {
    it('should return current position', () => {
      expect(source.getPosition()).toBe(0);
    });
  });

  describe('#setPosition()', () => {
    it('should set current position', () => {
      source.setPosition(1);
      expect(source.getPosition()).toBe(1);
      expect(source.getCurrentFrame()).toBe(0b00100010);
      source.setPosition(0);
      expect(source.getPosition()).toBe(0);
      expect(source.getCurrentFrame()).toBe(0b10111011);
    });
  });

  describe('#getFrameSize()', () => {
    it('should return frame size in bits', () => {
      expect(source.getFrameSize()).toBe(8);
    });
  });

  describe('#getCurrentFrame()', () => {
    it('should return current frame value', () => {
      expect(source.getCurrentFrame()).toBe(0b10111011);
    });
  });

  describe('#setCurrentFrame()', () => {
    it('should set value for current position', () => {
      source.setCurrentFrame(0b11000011);
      expect(source.getCurrentFrame()).toBe(0b11000011);
    });
  });

  describe('#nextFrame()', () => {
    it('should advance position to next frame', () => {
      source.nextFrame();
      expect(source.getPosition()).toBe(1);
      expect(source.getCurrentFrame()).toBe(0b00100010);
    });

    it('should wrap to 0 at last frame', () => {
      source.setPosition(1);
      source.nextFrame();
      expect(source.getPosition()).toBe(0);
    });
  });

  describe('#previousFrame()', () => {
    beforeEach(() => {
      source.setPosition(1);
    });

    it('should move to previous frame', () => {
      source.previousFrame();
      expect(source.getPosition()).toBe(0);
      expect(source.getCurrentFrame()).toBe(0b10111011);
    });

    it('should stay at 0 when already at start', () => {
      source.setPosition(0);
      source.previousFrame();
      expect(source.getPosition()).toBe(0);
    });
  });

  describe('#isLastFrame()', () => {
    it('should return false at first frame', () => {
      expect(source.isLastFrame()).toBe(false);
    });

    it('should return true at last frame', () => {
      source.nextFrame();
      expect(source.isLastFrame()).toBe(true);
    });
  });

  describe('#getFrame()', () => {
    it('should return frame value by index', () => {
      expect(source.getFrame(0)).toBe(0b10111011);
      expect(source.getFrame(1)).toBe(0b00100010);
    });
  });

  describe('#setFrame()', () => {
    it('should set frame value by index', () => {
      source.setFrame(3, 0);
      expect(source.getFrame(0)).toBe(3);
      source.setFrame(127, 1);
      expect(source.getFrame(1)).toBe(0b01111111);
      expect(source.toString()).toBe('00000011 01111111');
    });
  });

  describe('#getLength()', () => {
    it('should return data length', () => {
      expect(source.getLength()).toBe(2);
    });
  });

  describe('#setLength()', () => {
    it('should expand data with zero-padding', () => {
      source.setLength(4);
      expect(source.getLength()).toBe(4);
      expect(source.getSource()).toBeInstanceOf(Uint8Array);
      expect(source.toString()).toBe('10111011 00100010 00000000 00000000');
    });

    it('should truncate data', () => {
      source.setLength(1);
      expect(source.getLength()).toBe(1);
      expect(source.toString()).toBe('10111011');
    });
  });

  describe('#getSource()', () => {
    it('should return the underlying typed array', () => {
      expect(source.getSource()).toBe(data);
    });
  });

  describe('#toString()', () => {
    it('should return binary string representation', () => {
      expect(source.toString()).toBe('10111011 00100010');
    });
  });
});

describe('DynamicDataSource', () => {
  it('should auto-expand when position exceeds capacity', () => {
    const source = new DynamicDataSource(new Uint8Array(2));
    expect(source.getLength()).toBe(2);
    source.setPosition(2);
    expect(source.getLength()).toBeGreaterThan(2);
  });

  it('should start with a default buffer', () => {
    const source = new DynamicDataSource();
    expect(source.getLength()).toBeGreaterThan(0);
  });
});
