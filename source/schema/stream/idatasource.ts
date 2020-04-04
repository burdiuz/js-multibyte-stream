export type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array;

export interface IDataSource {
  getPosition(): number;
  setPosition(value: number): void;
  getFrameSize(): number;
  getCurrentFrame(): number;
  setCurrentFrame(value: number): void;
  nextFrame(): void;
  previousFrame(): void;
  isLastFrame(): boolean;
  getFrame(index: number): number;
  setFrame(value: number, index: number): void;
  getLength(): number;
  setLength(length: number): void;
  getSource(): TypedArray;
}
