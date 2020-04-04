export interface IType {
  writeTo(writer: IBitWriter): void;
  readFrom(writer: IBitReader): void;
}

export interface ITypeData {
  type: string;
}

export interface ITypeStatic {
  stringify(type: IType): ITypeData;
  parse(data: ITypeData): IType;
}
