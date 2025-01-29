import { Subject } from "rxjs";

export type LEDInterfacesI = Record<LEDName, LEDInterfaceI>;

export interface LEDInterfaceI
  extends Subject<LEDData>
{
  on(): void;
  off(): void;
  blinkOnce(ms?: number): void;
}

export const enum LEDName {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
}

export const enum LEDData {
  On = 1,
  Off = 0,
}
