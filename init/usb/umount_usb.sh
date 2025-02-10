#!/bin/bash

# /usr/local/bin/umount_usb.sh

DEVICE="/dev/$1"
MOUNTPOINT="/mnt/usb-$1"

umount "$DEVICE"

rmdir "$MOUNTPOINT"

echo "$(date): Unmounted $DEVICE from $MOUNTPOINT" >> /var/log/usb-mount.log
