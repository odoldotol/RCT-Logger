# RCT-Logger

### 모듈식 RCT 수신기 로거

<div>
  <img src="https://storage.googleapis.com/odoldotol-image-store/rct_logger_prototype_dev.jpeg" alt="" height="400">
</div>
[개발중인 프로토타입 사진 첨부]

<br>

## Design

생소한 도매인과 개발환경, test 방식 등으로 개발 안정성이 우려됨.  
이를 해소하고자 최대한 코드간 결합이 적게 보수적으로 전체를 디자인함.  
결국 부실한 테스트환경이나 생소한 도매인을 다루면서도 능율적으로 전체 개발 프로세스를 마침.

<br><br>

(웹서버, 특히 NestJS 의 디자인 패턴을 참고함)

<br>

### Layer

```
여기에서 구현된 부분에 * 표시

                |~~~~~~~~~~~~~~~~~~~~|
                |                    |
                |     GPIO / USB     |
                |                    |
|---------------|....................|
|               .                    |
|               .        *IO*        |
|               .                    |
|               |====================|  
| *IOInterface* .                    |
|               .       *APP*        |
|               .                    |
|               |....................|
|               .                    |
|               .        *DB*        |
|               .                    |
|---------------|....................|
                |                    |
                |     File System    |
                |                    |
                |====================|

```

```
구현된 부분을 조금 더 자세히 표현

|----------|-------------|-------------------------------------|------|
|          |             |                 APP                 |      |
|    IO    | IOInterface |------------:-----------:------------|  DB  |
|          |             |   Router   : Contoller :  Provider  |      |
|----------|-------------|------------:-----------:------------|------|
|          |             |            :           :            |      |
|          |             |  Receiver  :           :            |      |
| Receiver |   Receiver  |            :           :     *      |      |
|          |             |            :    Log    :            |      |
|   USB    |             | USBStorage :           :            |      |
|          |  USBStorage |            :           :            |      |
|   LED    |             |            :           :            |      |
|          |             |------------:-----------:------------|------|
|          |         LED                                              |
|----------|----------------------------------------------------------|
```

<br><br>

### DI IoC Singleton ...

<br><br>

### Multi Processing

serial data input 성능, 정확성 이슈를 해결.  
오차율 1/6000, 정확도 99.98%

<br><br>

## Stack

Raspberry Pi 4 Model B, 4GB RAM, BCM2711 (4Core&Thread)  
SanDisk Extreme | microSDXC UHS-I Card, 64GB  
Raspberry Pi OS Lite (64-bit), 438MB, Kernel version: 6.6, Debian version: 12 (bookworm)  
DS3231 (RTC)

NodeJS (22.13.1) / Typescript  
buffer / stream / fs / rxjs / exceljs  
child_process  
pm2 (5.4.3) / watchdog  
onoff / pigpio / udev  

<br><br>

## Data Flow

초기에, bit 를 buffer 로 다루고 간단한 함수들로 다루는 것이 효율성과 편의성에서 유리할 것으로 예상.  
개발하면서는 전체 프로세스를 binary 로 통일하고 객체로 다루는 것이 더 좋았을것 같다고 느꼈으나 원래대로 진행함.

<br>

### Serial Input

```
GPIO HIGH/LOW -> Buffer => binary
```

365, 24 / 1년치 로그데이터는 1GB


### Download as Excel

```
binary => Buffer => Excel
```

<br>

[data_spec](data_spec.md)

<br><br><br>

---
---

<br>

[DEV Documents](./DEV.md)