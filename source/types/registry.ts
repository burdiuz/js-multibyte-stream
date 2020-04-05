import { IType, ITypeStatic } from './itype';

export class TypeRegistry {
  private map = new Map<string | Function, ITypeStatic>();

  add(type: ITypeStatic) {
    const keys = type.getTypeKeys();

    keys.forEach((key) => this.addTypeFor(key, type));
  }

  addTypeFor(key: string | Function, type: ITypeStatic) {
    this.map.set(key, type);
  }

  hasTypeFor(key: string | Function): boolean {
    return this.map.has(key);
  }

  getTypeFor(key: string | Function): ITypeStatic {
    return this.map.get(key);
  }
}
