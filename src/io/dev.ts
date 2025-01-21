import { Gpio } from 'onoff';

Gpio.HIGH
Gpio.LOW
Gpio.accessible

const RECEIVER_STATUS_GPIO = 0;

/**
 * @todo 상승, 하강 엣지에서 상태 변화하기
 */
class ReceiverStatus
  extends Gpio
{
  private readonly status = false;

  constructor(
    gpio: number,
  ) {
    super(
      gpio,
      'in',
      "both",
    );
  }

  public getStatus(): boolean {
    return this.status;
  }

}

const receiverStatus = new ReceiverStatus(RECEIVER_STATUS_GPIO);
