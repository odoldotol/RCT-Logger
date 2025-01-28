export type LEDInterfacesI = Record<LEDName, LEDInterfaceI>;

export interface LEDInterfaceI {
  on(): void;
  off(): void;
  blinkOnce(ms?: number): void;
  blink(ms?: number): void;
}

export const enum LEDName {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
}
