import { IType } from '../types/itype';
import { defaultTypeRegistry, getValueTypeDefinition } from '../types/registry';

export const readObjectFieldTypes = (
  data: { [key: string]: any },
  registry = defaultTypeRegistry,
  target = {}
): { [key: string]: IType } => {
  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === null || value === undefined || key in target) {
      return;
    }

    const type = getValueTypeDefinition(value).getInstanceFor(registry, value);

    if (type) {
      target[key] = type;
    }
  });

  return target;
};
