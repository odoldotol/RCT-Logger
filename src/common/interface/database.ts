export interface Repository<T> {
  write(data: T): Promise<void>;
  read(): Promise<T>;
}