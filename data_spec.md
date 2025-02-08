# 1. Cycle

```
| 동기 Word | 정보 Word 1 | .... | 정보 Word 6 |
```

1 Cycle = 7 Word = 224 bits = 28 byte

</br>
</br>

# 2. Word

1 Word = 32 bits = 4 byte

</br>

## 1) 동기 Word

```
-___________29 bits___________--
```

</br>

## 2) 정보 Word

```
| 0 | 1 | 2 | 3 | ... | 14 | 15 | 16 | ... | 31 |

|___________|______________| PB |__________| PB |
word address       정보               반전

|__ 3bits __|___ 12 bits __|

|__________ 16 bits ____________|____16 bits____|
```

word address : 정보 워드의 주소  
PB(Parity bit) : even parity

</br>

## 3) Spec
자세한 스팩은 관련 문서 참고

</br>
</br>

# 3. Validations

수신기에서 검증 전 데이터를 로거가 받아야 함.  
수신기 프로그램은 변경불허.  

### WordAdress

### Parity

### Reverse

### MachineAddress
로거에서 할 수 없는 검증

### AR20