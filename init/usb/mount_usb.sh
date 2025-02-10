#!/bin/bash

# /usr/local/bin/mount_usb.sh

DEVICE="/dev/$1"
MOUNTPOINT="/mnt/usb-$1"

mkdir -p "$MOUNTPOINT"

TMPERR=$(mktemp)
if /bin/mount "$DEVICE" "$MOUNTPOINT" 2> "$TMPERR"; then
    echo "$(date): Mounted $DEVICE at $MOUNTPOINT" >> /var/log/usb-mount.log
else
    ERRMSG=$(cat "$TMPERR")
    echo "$(date): Failed to mount $DEVICE at $MOUNTPOINT - Error: $ERRMSG" >> /var/log/usb-mount.log

    rmdir "$MOUNTPOINT" 2>/dev/null
fi
rm -f "$TMPERR"
