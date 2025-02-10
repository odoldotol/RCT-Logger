const udev = require("udev");

// console.dir(udev);

// console.log(udev.list());

const monitor = udev.monitor("usb");

monitor.on('add', (device) => {
  console.log('added');
  console.log(device);
});

monitor.on('remove', (device) => {
  console.log('removed');
  console.log(device);
});

monitor.on('change', (device) => {
  console.log('changed');
  console.log(device);
});

// console.log(udev.list('tty'));




/*

// port 는 ID_PATH 또는 DEVPATH 에서 유추


"added"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1',
  ACTION: 'add',
  BUSNUM: '002',
  CURRENT_TAGS: ':seat:',
  DEVNAME: '/dev/bus/usb/002/011',
  DEVNUM: '011',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1',
  DEVTYPE: 'usb_device',
  DRIVER: 'usb',
  ID_BUS: 'usb',
  ID_FOR_SEAT: 'usb-platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1',
  ID_MODEL: 'ADATA_USB_Flash_Drive',
  ID_MODEL_ENC: 'ADATA\\x20USB\\x20Flash\\x20Drive',
  ID_MODEL_ID: 'dd4a',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1',
  ID_REVISION: '1100',
  ID_SERIAL: 'ADATA_ADATA_USB_Flash_Drive_25B17064100100CF',
  ID_SERIAL_SHORT: '25B17064100100CF',
  ID_USB_INTERFACES: ':080650:',
  ID_USB_MODEL: 'ADATA_USB_Flash_Drive',
  ID_USB_MODEL_ENC: 'ADATA\\x20USB\\x20Flash\\x20Drive',
  ID_USB_MODEL_ID: 'dd4a',
  ID_USB_REVISION: '1100',
  ID_USB_SERIAL: 'ADATA_ADATA_USB_Flash_Drive_25B17064100100CF',
  ID_USB_SERIAL_SHORT: '25B17064100100CF',
  ID_USB_VENDOR: 'ADATA',
  ID_USB_VENDOR_ENC: 'ADATA',
  ID_USB_VENDOR_ID: '125f',
  ID_VENDOR: 'ADATA',
  ID_VENDOR_ENC: 'ADATA',
  ID_VENDOR_FROM_DATABASE: 'A-DATA Technology Co., Ltd.',
  ID_VENDOR_ID: '125f',
  MAJOR: '189',
  MINOR: '138',
  PRODUCT: '125f/dd4a/1100',
  SEQNUM: '3246',
  SUBSYSTEM: 'usb',
  TAGS: ':seat:',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58239243872'
}
"added"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1/2-1:1.0',
  ACTION: 'add',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1/2-1:1.0',
  DEVTYPE: 'usb_interface',
  DRIVER: 'usb-storage',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1:1.0',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1_0',
  ID_VENDOR_FROM_DATABASE: 'A-DATA Technology Co., Ltd.',
  INTERFACE: '8/6/80',
  MODALIAS: 'usb:v125FpDD4Ad1100dc00dsc00dp00ic08isc06ip50in00',
  PRODUCT: '125f/dd4a/1100',
  SEQNUM: '3247',
  SUBSYSTEM: 'usb',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58239251572'
}

"removed"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1/2-1:1.0',
  ACTION: 'remove',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1/2-1:1.0',
  DEVTYPE: 'usb_interface',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1:1.0',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1_0',
  INTERFACE: '8/6/80',
  MODALIAS: 'usb:v125FpDD4Ad1100dc00dsc00dp00ic08isc06ip50in00',
  PRODUCT: '125f/dd4a/1100',
  SEQNUM: '3277',
  SUBSYSTEM: 'usb',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58239251572'
}
"removed"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1',
  ACTION: 'remove',
  BUSNUM: '002',
  DEVNAME: '/dev/bus/usb/002/011',
  DEVNUM: '011',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1',
  DEVTYPE: 'usb_device',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1',
  MAJOR: '189',
  MINOR: '138',
  PRODUCT: '125f/dd4a/1100',
  SEQNUM: '3279',
  SUBSYSTEM: 'usb',
  TAGS: ':seat:',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58239243872'
}

"added"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1',
  ACTION: 'add',
  BUSNUM: '001',
  CURRENT_TAGS: ':seat:',
  DEVNAME: '/dev/bus/usb/001/007',
  DEVNUM: '007',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1',
  DEVTYPE: 'usb_device',
  DRIVER: 'usb',
  ID_BUS: 'usb',
  ID_DRIVE_THUMB: '1',
  ID_FOR_SEAT: 'usb-platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1',
  ID_MODEL: 'Cruzer_Switch',
  ID_MODEL_ENC: 'Cruzer\\x20Switch',
  ID_MODEL_FROM_DATABASE: 'Cruzer Switch',
  ID_MODEL_ID: '5572',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.1',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1',
  ID_REVISION: '0126',
  ID_SERIAL: 'SanDisk_Cruzer_Switch_4C531001501203116594',
  ID_SERIAL_SHORT: '4C531001501203116594',
  ID_USB_INTERFACES: ':080650:',
  ID_USB_MODEL: 'Cruzer_Switch',
  ID_USB_MODEL_ENC: 'Cruzer\\x20Switch',
  ID_USB_MODEL_ID: '5572',
  ID_USB_REVISION: '0126',
  ID_USB_SERIAL: 'SanDisk_Cruzer_Switch_4C531001501203116594',
  ID_USB_SERIAL_SHORT: '4C531001501203116594',
  ID_USB_VENDOR: 'SanDisk',
  ID_USB_VENDOR_ENC: 'SanDisk',
  ID_USB_VENDOR_ID: '0781',
  ID_VENDOR: 'SanDisk',
  ID_VENDOR_ENC: 'SanDisk',
  ID_VENDOR_FROM_DATABASE: 'SanDisk Corp.',
  ID_VENDOR_ID: '0781',
  MAJOR: '189',
  MINOR: '6',
  PRODUCT: '781/5572/126',
  SEQNUM: '3280',
  SUBSYSTEM: 'usb',
  TAGS: ':seat:',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58445982538'
}
"added"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1/1-1.1:1.0',
  ACTION: 'add',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1/1-1.1:1.0',
  DEVTYPE: 'usb_interface',
  DRIVER: 'usb-storage',
  ID_MODEL_FROM_DATABASE: 'Cruzer Switch',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.1:1.0',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1_1_0',
  ID_VENDOR_FROM_DATABASE: 'SanDisk Corp.',
  INTERFACE: '8/6/80',
  MODALIAS: 'usb:v0781p5572d0126dc00dsc00dp00ic08isc06ip50in00',
  PRODUCT: '781/5572/126',
  SEQNUM: '3281',
  SUBSYSTEM: 'usb',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58445990350'
}

"removed"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1/1-1.1:1.0',
  ACTION: 'remove',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1/1-1.1:1.0',
  DEVTYPE: 'usb_interface',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.1:1.0',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1_1_0',
  INTERFACE: '8/6/80',
  MODALIAS: 'usb:v0781p5572d0126dc00dsc00dp00ic08isc06ip50in00',
  PRODUCT: '781/5572/126',
  SEQNUM: '3311',
  SUBSYSTEM: 'usb',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58445990350'
}
"removed"
device = {
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1',
  ACTION: 'remove',
  BUSNUM: '001',
  DEVNAME: '/dev/bus/usb/001/007',
  DEVNUM: '007',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb1/1-1/1-1.1',
  DEVTYPE: 'usb_device',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1.1',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1',
  MAJOR: '189',
  MINOR: '6',
  PRODUCT: '781/5572/126',
  SEQNUM: '3313',
  SUBSYSTEM: 'usb',
  TAGS: ':seat:',
  TYPE: '0/0/0',
  USEC_INITIALIZED: '58445982538'
}

*/