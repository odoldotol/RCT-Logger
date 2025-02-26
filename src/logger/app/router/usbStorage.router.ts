import {
  mkdir,
  // readFile,
} from "fs/promises";
import * as Path from "path";
import {
  Logger,
  Router
} from "../../../common";
import {
  DEVNAME,
  MountedDir,
  UsbStorageInterface,
  UsbStorageInterfaceEvent
} from "../../ioInterface";
import { LogController } from "../log";
import { createWriteStream, WriteStream } from "fs";

export class UsbStorageRouter
  implements Router
{
  private readonly logger = new Logger(UsbStorageRouter.name);

  private readonly downloadBasename = "rct_log"; // env, config 에서 읽어오기
  // private readonly downloadRangeFileName = "download.txt";

  constructor(
    private readonly usbStorageInterface: UsbStorageInterface,
    private readonly logController: LogController
  ) {}

  public listen() {
    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Mounted, this.mountedHandler.bind(this));
    this.usbStorageInterface.on(UsbStorageInterfaceEvent.Umounted, this.umountedHandler.bind(this));

    this.logger.log("UsbStorageRouter is listening.");
  }

  private async mountedHandler(
    deviceName: DEVNAME,
    mountedDir: MountedDir
  ): Promise<void> {
    // this.logger.log(`get event Mounted ${deviceName} ${mountedDir}`); // temp
    
    const downloadDir = this.getDownloadDir(mountedDir);

    let rangeQuery: string;
    let writeStream: WriteStream;
    try {
      // Todo: range 읽기에 실패해도 (실패로그는 쓰지만) 기본값으로 다운로드 진행시키기 <- 크레인까지 올라가는 수고가 너무 큼, 노트북 들고 올라가기 어려움.
      rangeQuery = await this.getRangeQuery(downloadDir, mountedDir);
      writeStream = await this.getWriteStream(downloadDir);
    } catch (error) {
      this.answerError(error, deviceName, mountedDir);
      return;
    }

    writeStream
    .on("finish", () => this.answerComplete(deviceName, mountedDir))
    .on("error", error => this.answerError(error, deviceName, mountedDir));

    try {
      await this.logController.download(
        writeStream,
        rangeQuery
      );
    } catch (error: any) {
      writeStream.destroy(error);
    }
  }

  private async umountedHandler(
    deviceName: DEVNAME
  ): Promise<void> {
    this.logger.log(`get event Umounted ${deviceName}`); // temp
  }

  private answerComplete(
    deviceName: DEVNAME,
    mountedDir: MountedDir
  ) {
    this.usbStorageInterface.emit(UsbStorageInterfaceEvent.Complete, deviceName, mountedDir);
  }

  private answerError(
    error: any,
    deviceName: DEVNAME,
    mountedDir: MountedDir
  ) {
    this.logger.error(`Failed to Download`, error);
    // 가능하다면 txt 쓰기
    this.usbStorageInterface.emit(UsbStorageInterfaceEvent.Error, deviceName, mountedDir);
  }

  private async getWriteStream(
    downloadDir: string
  ): Promise<WriteStream> {
    await mkdir(downloadDir, { recursive: true });

    return createWriteStream(Path.resolve(downloadDir, this.getDwonloadFileName()))
  }

  /**
   * ### Not implemented
   * 마운티드의 다운로드Dir, 루트 순으로 읽고 먼저 보이는 놈 채택  
   * 인코딩 유추해서 읽기. utf8 utf16 win1252-0 등 일듯.  
   * 
   * @todo 비정상적으로 큰 파일을 만날시 대비
   */
  private async getRangeQuery(
    _downloadDir: string,
    _mountedDir: MountedDir
  ): Promise<string> {
    // readFile(Path.resolve(downloadDir, this.downloadRangeFileName), { encoding: "utf-8" });
    // readFile(Path.resolve(mountedDir, this.downloadRangeFileName), { encoding: "utf-8" });

    return '';
  }

  private getDownloadDir(mountedDir: MountedDir): string {
    return Path.resolve(mountedDir, this.downloadBasename);
  }

  private getDwonloadFileName(): string {
    const now = new Date();
    return `download_${now.toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("-")}_${now.toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" }).replace(/:/g, "-")}.xlsx`;
  }
 
}
