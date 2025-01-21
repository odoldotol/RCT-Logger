# RCT-Logger


## Design
### Layer
```
   IO    | IOInterface |  Router  : Contoller :  Provider  | DB
-----------------------------------------------------------------
         |             |          :           :            |
Receiver |             | Receiver :           :  service   |
         |             |          :    Log    :            |
Client   |             |    USB   :           : repository |
         |             |          :           :            |
LED      |             |          :           :            |
         |             |          :           :            |
```
꼭 위와 같은것은 아님 (IO인터페이스는 전역적 성향이 강하며 프로바이더에서도 쓰임)

