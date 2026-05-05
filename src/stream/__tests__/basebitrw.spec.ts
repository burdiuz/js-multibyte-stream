import { describe, it, expect, beforeEach } from '@jest/globals';
import { Endian } from '../../endian';
import { BaseBitRW } from '../basebitrw';
import { DataSource } from '../datasource';

describe('BaseBitRW', () => {
  let bitrw: BaseBitRW;

  beforeEach(() => {
    bitrw = new BaseBitRW();
  });

  describe('#getData()', () => {
    it('should return the underlying typed array', () => {
      const data = new Uint8Array(4);
      bitrw.setData(data);
      expect(bitrw.getData()).toBe(data);
    });
  });

  describe('#setData()', () => {
    it('should use default Uint8Array when called without args', () => {
      bitrw.setData();
      expect(bitrw.getData()).toBeInstanceOf(Uint8Array);
    });

    it('should store provided typed array', () => {
      const data = new Uint8Array(4);
      bitrw.setData(data);
      expect(bitrw.getData()).toBe(data);
    });
  });

  describe('#getSource()', () => {
    it('should return a DataSource instance', () => {
      bitrw.setData(new Uint8Array(4));
      expect(bitrw.getSource()).toBeInstanceOf(DataSource);
    });
  });

  describe('#setSource()', () => {
    it('should replace the data source', () => {
      const newSource = new DataSource(new Uint8Array(4));
      bitrw.setSource(newSource);
      expect(bitrw.getSource()).toBe(newSource);
    });
  });

  describe('#getBitOrder()', () => {
    it('should default to big endian', () => {
      expect(bitrw.getBitOrder()).toBe(Endian.BIG);
    });
  });

  describe('#setBitOrder()', () => {
    it('should set to little endian', () => {
      bitrw.setBitOrder(Endian.LITTLE);
      expect(bitrw.getBitOrder()).toBe(Endian.LITTLE);
    });

    it('should set back to big endian', () => {
      bitrw.setBitOrder(Endian.LITTLE);
      bitrw.setBitOrder(Endian.BIG);
      expect(bitrw.getBitOrder()).toBe(Endian.BIG);
    });
  });

  describe('#getPosition()', () => {
    it('should return 0 at start', () => {
      bitrw.setData(new Uint8Array(4));
      expect(bitrw.getPosition()).toBe(0);
    });

    it('should reflect setPosition', () => {
      bitrw.setData(new Uint8Array(4));
      bitrw.setPosition(16);
      expect(bitrw.getPosition()).toBe(16);
    });
  });

  describe('#setPosition()', () => {
    it('should set bit position within a frame', () => {
      bitrw.setData(new Uint8Array(4));
      bitrw.setPosition(5);
      expect(bitrw.getPosition()).toBe(5);
    });

    it('should set position spanning multiple frames', () => {
      bitrw.setData(new Uint8Array(4));
      bitrw.setPosition(20);
      expect(bitrw.getPosition()).toBe(20);
    });
  });

  describe('#getBytePosition()', () => {
    it('should return 0 at start', () => {
      bitrw.setData(new Uint8Array(4));
      expect(bitrw.getBytePosition()).toBe(0);
    });

    it('should return correct byte position after setting bit position', () => {
      bitrw.setData(new Uint8Array(4));
      bitrw.setPosition(16);
      expect(bitrw.getBytePosition()).toBe(2);
    });

    it('should round up partial bytes', () => {
      bitrw.setData(new Uint8Array(4));
      bitrw.setPosition(9);
      expect(bitrw.getBytePosition()).toBe(2);
    });
  });

  describe('#getFrameSize()', () => {
    it('should return 8 for Uint8Array', () => {
      bitrw.setData(new Uint8Array(4));
      expect(bitrw.getFrameSize()).toBe(8);
    });

    it('should return 16 for Uint16Array', () => {
      bitrw.setData(new Uint16Array(4));
      expect(bitrw.getFrameSize()).toBe(16);
    });

    it('should return 32 for Uint32Array', () => {
      bitrw.setData(new Uint32Array(4));
      expect(bitrw.getFrameSize()).toBe(32);
    });
  });
});
