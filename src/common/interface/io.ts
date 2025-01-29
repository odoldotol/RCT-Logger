export interface IO {
  open(): void | Promise<void>;
  close(): void | Promise<void>;
}
