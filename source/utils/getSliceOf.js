import { getMaskOfLength } from "./getMaskOfLength";

export const getSliceOf = (value, position, size) =>
  (value >> position) & getMaskOfLength(size);

export const getPartFrom = (value, size, position = 0) =>
  getSliceOf(value, position * size, size);

export const getByteFrom = (value, position = 0) =>
  getSliceOf(value, position * SIZE, SIZE);

export const toSlices = (value, ...sizes) => {
  let position = 0;

  return sizes.map((size) => {
    const slice = getSliceOf(value, position, size);
    position += size;

    return slice;
  });
};
