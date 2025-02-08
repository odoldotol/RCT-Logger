import {
  B103ExtractedData,
  B12DataWord6,
  B192DataWord6,
  B19Data,
  B1Subject,
  B6Timestamp,
  B96ExtractedDataWord6
} from "./interface";

export * from "./interface";
export * from "./const";
export * from "./validate";

export const getB6Timestamp = (
  buffer: B103ExtractedData | B19Data
): B6Timestamp => {
  return buffer.subarray(0, 6) as B6Timestamp;
};

export const getB1Subject = (
  buffer: B103ExtractedData | B19Data
): B1Subject => {
  return buffer.subarray(6, 7) as B1Subject;
};

export const getB96ExtractedDataWord6 = (
  buffer: B103ExtractedData
): B96ExtractedDataWord6 => {
  return buffer.subarray(7) as B96ExtractedDataWord6;
};

export const getB12DataWord6 = (
  buffer: B19Data
): B12DataWord6 => {
  return buffer.subarray(7) as B12DataWord6;
};

export const extractWordData = (
  buffer: B192DataWord6
): B96ExtractedDataWord6 => {
  return Buffer.concat([
    buffer.subarray(0, 16),
    buffer.subarray(32, 48),
    buffer.subarray(64, 80),
    buffer.subarray(96, 112),
    buffer.subarray(128, 144),
    buffer.subarray(160, 176),
  ]) as B96ExtractedDataWord6;
};