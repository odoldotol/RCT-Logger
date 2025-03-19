export interface IO {
  open: SyncOpen | AsyncOpen;
  close: Close;
}

export interface AsyncOpenIO {
  open: AsyncOpen;
  close: Close;
}

export interface SyncOpenIO {
  open: SyncOpen;
  close: Close;
}

interface AsyncOpen {
  (): Promise<boolean>;
}

interface SyncOpen {
  (): boolean;
}

interface Close {
  (): boolean;
}
