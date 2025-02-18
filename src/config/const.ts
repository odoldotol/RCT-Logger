export const enum EnvKey {
  AR20_PIN = "AR20_PIN",
  AR20_DEBOUNCE = "AR20_DEBOUNCE",

  SERIAL_PIN = "SERIAL_DATA_PIN",

  SERIAL_CLK_PIN = "SERIAL_CLK_PIN",
  SERIAL_CLK_DEBOUNCE = "SERIAL_CLK_DEBOUNCE",

  LED_A_PIN = "LED_A_PIN",
  LED_B_PIN = "LED_B_PIN",
  LED_C_PIN = "LED_C_PIN",
  LED_D_PIN = "LED_D_PIN",

  DB_SOCKET_PATH = "DB_SOCKET_PATH",
  DB_STORAGE_PATH = "DB_STORAGE_PATH",
  DB_BATCH_INTERVAL = "DB_BATCH_INTERVAL",
}

export const enum LedGpioName {
  DownloadGreen,
  DownloadYellow,
  DatabaseAppend,
  Test,
}

export const enum ReceiverGpioName {
  AR20,
  SERIAL,
  SERIAL_CLK,
}
