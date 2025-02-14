import {
  Logger,
  Router
} from "../../../common";
import { UsbStorageInterface, UsbStorageInterfaceEvent } from "../../ioInterface";
import { LogController } from "../log";

export class UsbStorageRouter
  implements Router
{

  private readonly logger = new Logger(UsbStorageRouter.name);

  constructor(
    private readonly usbStorageInterface: UsbStorageInterface,
    private readonly logController: LogController
  ) {}

  public listen() {
    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Mounted, (deviceName, mountedDir) => {
      // 스토리지 루트에 rct_log 디렉토리 만들기
      // 스토리지 루트 혹은 rct_log 에 download.txt 파일 있는지 검사하고 있으면 읽기

      this.logController // .download(mountedDir, [])

      this.logger.log(`get event Mounted ${deviceName} ${mountedDir}`);
    });

    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Umounted, (deviceName) => {
      this.logger.log(`get event Umounted ${deviceName}`);
    });

    this.logger.log("UsbStorageRouter is listening.");
  }
 
}
