import assert from './assert';

export const NOT_A_NUMBER_ERROR = 'Value must be of type Number.';

const isNumeric = (value) => {
  return value === +value;
};

export const assertNumeric = (value) => assert(isNumeric(value), NOT_A_NUMBER_ERROR);
export default isNumeric;
