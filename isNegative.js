import { assertNumeric } from './isNumeric';

export const NOT_POSITIVE_NUMBER_ERROR = 'Value must be a positive number.';
export const NOT_NEGATIVE_NUMBER_ERROR = 'Value must be a negative number.';

const isNegative = (value) => {
  assertNumeric(value);
  return value < 0;
};

export const assertNegative = (value) => assert(isNegative(value), NOT_NEGATIVE_NUMBER_ERROR);
export const assertPositive = (value) => assert(!isNegative(value), NOT_POSITIVE_NUMBER_ERROR);

export default isNegative;
