import {
  B103ExtractedData,
  B12DataWord6,
  B192DataWord6,
  B19Data,
  B1Subject,
  B6Timestamp,
  B96ExtractedDataWord6,
} from "./interface";

export const throwIfNotB6Timestamp = (buffer: Buffer): void => {
  if (isB6Timestamp(buffer) == false) {
    throw new Error(`${buffer} is not B6Timestamp`);
  }
};

export const throwIfNotB1Subject = (buffer: Buffer): void => {
  if (isB1Subject(buffer) == false) {
    throw new Error(`${buffer} is not B1Subject`);
  }
};

export const throwIfNotB192DataWord6 = (buffer: Buffer): void => {
  if (isB192DataWord6(buffer) == false) {
    throw new Error(`${buffer} is not B192DataWord6`);
  }
};

export const throwIfNotB96ExtractedDataWord6 = (buffer: Buffer): void => {
  if (isB96ExtractedDataWord6(buffer) == false) {
    throw new Error(`${buffer} is not B96ExtractedDataWord6`);
  }
};

export const throwIfNotB12DataWord6 = (buffer: Buffer): void => {
  if (isB12DataWord6(buffer) == false) {
    throw new Error(`${buffer} is not B12DataWord6`);
  }
};

export const throwIfNotB103ExtractedData = (buffer: Buffer): void => {
  if (isB103ExtractedData(buffer) == false) {
    throw new Error(`${buffer} is not B103ExtractedData`);
  }
};

export const throwIfNotB19Data = (buffer: Buffer): void => {
  if (isB19Data(buffer) == false) {
    throw new Error(`${buffer} is not B19Data`);
  }
};

export const isB6Timestamp = (buffer: Buffer): buffer is B6Timestamp => {
  return isByteLength(6, buffer);
};

export const isB1Subject = (buffer: Buffer): buffer is B1Subject => {
  return isByteLength(1, buffer);
};

export const isB192DataWord6 = (buffer: Buffer): buffer is B192DataWord6 => {
  return isByteLength(192, buffer);
};

export const isB96ExtractedDataWord6 = (buffer: Buffer): buffer is B96ExtractedDataWord6 => {
  return isByteLength(96, buffer);
};

export const isB12DataWord6 = (buffer: Buffer): buffer is B12DataWord6 => {
  return isByteLength(12, buffer);
};

export const isB103ExtractedData = (buffer: Buffer): buffer is B103ExtractedData => {
  return isByteLength(103, buffer);
};

export const isB19Data = (buffer: Buffer): buffer is B19Data => {
  return isByteLength(19, buffer);
};

export const isByteLength = (
  length: number,
  buffer: Buffer
): boolean => {
  return buffer.byteLength == length;
};