/**
 * 6 bytes 에 압축 기록된 시간 정보.
 */
export interface B6Timestamp
  extends Buffer
{
  byteLength: 6;
}

/**
 * 1 byte 에 기록된 Log Subject.
 */
export interface B1Subject
  extends Buffer
{
  byteLength: 1;
}

/**
 * 32bit HIGH/LOW 의 DataWord 1개를 32bytes 에 기록.  
 * 6개를 연결하여 192 bytes.
 */
export interface B192DataWord6
  extends Buffer
{
  byteLength: 192;
}

/**
 * B192DataWord6 에서 검증부를 제거하여 절반으로 줄인것.  
 * 96 bytes.
 */
export interface B96ExtractedDataWord6
  extends Buffer
{
  byteLength: 96; // 192/2
}

/**
 * B96ExtractedDataWord6 를 12 bytes 로 압축.  
 * 
 * 8 btyes 를 1 byte 로 압축(비트패킹)한것.
 */
export interface B12DataWord6
  extends Buffer
{
  byteLength: 12;
}

/**
 * B6Timestamp, B1Subject, B96ExtractedDataWord6 를 이어 총 103 bytes.
 */
export interface B103ExtractedData
  extends Buffer
{
  byteLength: 103;
}

/**
 * B6Timestamp, B1Subject, B12DataWord6 를 이어 총 19 bytes.
 */
export interface B19Data
  extends Buffer
{
  byteLength: 19;
}
