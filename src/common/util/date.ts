// Date 를 Buffer(Uint8Array) 에 저장/복원
// 이 코드가 오래 살아남아도 getTime 으로 얻은 시간이 48bit 를 넘어갈 일이 없을테니 버퍼는 6byte 만 사용.

import {
  throwIfNotB6Timestamp,
  B6Timestamp
} from "../data";

/**
 * @param date 기본값은 현재 시간
 */
export const packDateBuffer = (date = new Date()): B6Timestamp => {
  return packUTCMsB6Timestamp(date.getTime());
};

export const unpackB6Timestamp = (buffer: B6Timestamp): Date => {
  return new Date(unpackUTCMsB6Timestamp(buffer));
};

export const packUTCMsB6Timestamp = (ms: number): B6Timestamp => {
  if (
    Number.isSafeInteger(ms) === false ||
    ms < 0
  ) {
    throw new Error(`UTC ms Error: ${ms}`);
  }

  const buffer = Buffer.allocUnsafe(6) as B6Timestamp;

  let t = ms;
  for (let i = 5; i >= 0; i--) {
    buffer[i] = t & 0xFF;
    t = Math.floor(t / 256);
  }

  return buffer;
};

export const unpackUTCMsB6Timestamp = (buffer: B6Timestamp): number => {
  throwIfNotB6Timestamp(buffer);

  let time = 0;
  for (let i = 0; i < 6; i++) {
    time = time * 256 + buffer[i]!;
  }

  return time;
};

const DAY_MS = 1000 * 60 * 60 * 24; // 86400000
const HOUR_MS = 1000 * 60 * 60; // 3600000
const KOR_OFFSET_MS = -9 * HOUR_MS; // 32400000

export const getKORMs = (UTCMs = new Date().getTime()): number => {
  return UTCMs + KOR_OFFSET_MS;
};

const getUTCMidnightMs = (ms = new Date().getTime()): number => {
  return ms - (ms % DAY_MS);
};

/**
 * 
 * @param ms 기본값은 현재 시간
 */
export const getKORMidnightMs = (ms = new Date().getTime()): number => {
  const mid1 = getKORMs(getUTCMidnightMs(ms));
  const mid2 = mid1 + DAY_MS;
  if (mid2 > ms) {
    return mid1;
  } else {
    return mid2
  }
};