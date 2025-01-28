// IO 에서는 binary(H/L) -> Unit8Array -> Date, boolean[]

/**
 * 1, 8, 32, 64 비트연산 성능과 boolean, string(length = 1), number 의 논리연산과 메모리 사용을 다 고려했을때
 * 바이너리 시리얼을 boolean[] 으로 처리하는게 가장 능율적이고 효율적.
 */
type Serial = boolean[];

export interface Cycle {
  date: Date;
  serial: Serial
}










// data : 시간,시리얼\n