const udev = require("udev");
const { exec } = require('child_process');

// console.dir(udev);

// console.log(udev.list());

const usbMonitor = udev.monitor("usb");
const blockMonitor = udev.monitor("block");

usbMonitor.on('add', (device) => {
  logIf(device);
});

usbMonitor.on('remove', (device) => {
  logIf(device);
});

usbMonitor.on('change', (device) => {
  logIf(device);
});

// kernelName: device.DEVNAME.split("/").pop();

blockMonitor.on('add', (device) => {
  if (filter(device)) {
    const MOUNTPOINT = "/mnt/usb-" + device.DEVNAME.split("/").pop();
    exec(`mkdir -p ${MOUNTPOINT}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stderr) {
        console.error(stderr);
        return;
      }
      console.log(stdout);

      exec(`mount ${device.DEVNAME} ${MOUNTPOINT}`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          exec(`rmdir ${MOUNTPOINT}`, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }
            if (stderr) {
              console.error(stderr);
              return;
            }
            console.log(stdout);
          });
          return;
        }
        if (stderr) {
          console.error(stderr);
          exec(`rmdir ${MOUNTPOINT}`, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }
            if (stderr) {
              console.error(stderr);
              return;
            }
            console.log(stdout);
          });
          return;
        }
        console.log(stdout);
      });
    });
  }
});

blockMonitor.on('remove', (device) => {
  if (filter(device)) {
    const MOUNTPOINT = "/mnt/usb-" + device.DEVNAME.split("/").pop();
    exec(`umount ${MOUNTPOINT}`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stderr) {
        console.error(stderr);
        return;
      }
      console.log(stdout);

      exec(`rmdir ${MOUNTPOINT}`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stderr) {
          console.error(stderr);
          return;
        }
        console.log(stdout);
      });
    });
  }
});

/*
$ sudo umount /mnt/usb-sda1
umount: /mnt/usb-sda1: not mounted.

$ sudo umount /mnt/usb-sda1
umount: /mnt/usb-sda1: no mount point specified.

$ sudo rmdir /mnt/usb-sda1
rmdir: failed to remove '/mnt/usb-sda1': No such file or directory

$ sudo rmdir /mnt/usb-sda1
rmdir: failed to remove '/mnt/usb-sda1': Device or resource busy
*/

blockMonitor.on('change', (device) => {
  logIf(device);
});

// console.log(udev.list('tty'));

const filter = (device) => {
  if (
    device.SUBSYSTEM == "block" &&
    device.ID_BUS == "usb" &&
    device.DEVTYPE == "partition"
  ) {
    return true;
  } else {
    return false;
  }
};


const logIf = (device) => {
  if (
    device.SUBSYSTEM == "block" &&
    device.ID_BUS == "usb" &&
    device.DEVTYPE == "partition"
  ) {
    console.log(device);
  }
};



/*

// port 는 ID_PATH 또는 DEVPATH 에서 유추

{
  syspath: '/sys/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1/2-1:1.0/host0/target0:0:0/0:0:0:0/block/sda/sda1',
  ACTION: 'add',
  CURRENT_TAGS: ':systemd:',
  DEVLINKS: '/dev/disk/by-path/platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1:1.0-scsi-0:0:0:0-part1 /dev/disk/by-id/usb-ADATA_USB_Flash_Drive_25B17064100100CF-0:0-part1 /dev/disk/by-label/KSW /dev/disk/by-partuuid/c3072e18-01 /dev/disk/by-uuid/B569-E256',
  DEVNAME: '/dev/sda1',
  DEVPATH: '/devices/platform/scb/fd500000.pcie/pci0000:00/0000:00:00.0/0000:01:00.0/usb2/2-1/2-1:1.0/host0/target0:0:0/0:0:0:0/block/sda/sda1',
  DEVTYPE: 'partition',
  DISKSEQ: '57',
  ID_BUS: 'usb',
  ID_FS_LABEL: 'KSW',
  ID_FS_LABEL_ENC: 'KSW',
  ID_FS_TYPE: 'vfat',
  ID_FS_USAGE: 'filesystem',
  ID_FS_UUID: 'B569-E256',
  ID_FS_UUID_ENC: 'B569-E256',
  ID_FS_VERSION: 'FAT32',
  ID_INSTANCE: '0:0',
  ID_MODEL: 'USB_Flash_Drive',
  ID_MODEL_ENC: 'USB\\x20Flash\\x20Drive\\x20',
  ID_MODEL_ID: 'dd4a',
  ID_PART_ENTRY_DISK: '8:0',
  ID_PART_ENTRY_NUMBER: '1',
  ID_PART_ENTRY_OFFSET: '96',
  ID_PART_ENTRY_SCHEME: 'dos',
  ID_PART_ENTRY_SIZE: '60620704',
  ID_PART_ENTRY_TYPE: '0xc',
  ID_PART_ENTRY_UUID: 'c3072e18-01',
  ID_PART_TABLE_TYPE: 'dos',
  ID_PART_TABLE_UUID: 'c3072e18',
  ID_PATH: 'platform-fd500000.pcie-pci-0000:01:00.0-usb-0:1:1.0-scsi-0:0:0:0',
  ID_PATH_TAG: 'platform-fd500000_pcie-pci-0000_01_00_0-usb-0_1_1_0-scsi-0_0_0_0',
  ID_REVISION: '1100',
  ID_SERIAL: 'ADATA_USB_Flash_Drive_25B17064100100CF-0:0',
  ID_SERIAL_SHORT: '25B17064100100CF',
  ID_TYPE: 'disk',
  ID_USB_DRIVER: 'usb-storage',
  ID_USB_INSTANCE: '0:0',
  ID_USB_INTERFACES: ':080650:',
  ID_USB_INTERFACE_NUM: '00',
  ID_USB_MODEL: 'USB_Flash_Drive',
  ID_USB_MODEL_ENC: 'USB\\x20Flash\\x20Drive\\x20',
  ID_USB_MODEL_ID: 'dd4a',
  ID_USB_REVISION: '1100',
  ID_USB_SERIAL: 'ADATA_USB_Flash_Drive_25B17064100100CF-0:0',
  ID_USB_SERIAL_SHORT: '25B17064100100CF',
  ID_USB_TYPE: 'disk',
  ID_USB_VENDOR: 'ADATA',
  ID_USB_VENDOR_ENC: 'ADATA\\x20\\x20\\x20',
  ID_USB_VENDOR_ID: '125f',
  ID_VENDOR: 'ADATA',
  ID_VENDOR_ENC: 'ADATA\\x20\\x20\\x20',
  ID_VENDOR_ID: '125f',
  MAJOR: '8',
  MINOR: '1',
  PARTN: '1',
  SEQNUM: '3820',
  SUBSYSTEM: 'block',
  TAGS: ':systemd:',
  USEC_INITIALIZED: '93718130388'
}

*/