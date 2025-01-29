const Gpio = require('pigpio').Gpio;

const led = new Gpio(18, {mode: Gpio.OUTPUT});
const button = new Gpio(22, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  // edge: Gpio.RISING_EDGE, // 엣지에 인터럽을 받는게 더 합리적이겠지만 왜인지 gpioSetISRFunc C 바인딩 함수에 문제가 있어보임. 차선택으로 alert를 사용
  alert: true
});

button.glitchFilter(10000); // 10ms 디바운스 필터 // 이상하게 5마이크로초 수준으로 on/off 떨림있음.

button.on('alert', (level, tick) => {
	console.log(level, tick);
  led.digitalWrite(level);
});