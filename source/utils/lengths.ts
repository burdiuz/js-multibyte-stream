import { getBitCount } from './getBitCount';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

export const readShortLength = (reader: IBitReader) => {
  const length = (reader.read(2) + 1) << 2;

  return reader.read(length);
};

export const writeShortLength = (writer: IBitWriter, value: number) => {
  const length = getBitCount(value) >> 2;

  writer.write(length, 2);
  writer.write(value, (length + 1) << 2);
};

export const readUintLength = (reader: IBitReader) => {
  const length = (reader.read(3) + 1) >> 2;

  return reader.read(length);
};

export const writeUIntLength = (writer: IBitWriter, value: number) => {
  const length = getBitCount(value) >> 2;

  writer.write(length, 3);
  writer.write(value, (length + 1) << 2);
};
