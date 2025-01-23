# GPIO18 에 연결된 LED 1초간 켜고 끄기

echo "530" > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio530/direction
echo "1" > /sys/class/gpio/gpio530/value
sleep 1
echo "0" > /sys/class/gpio/gpio530/value
echo "530" > /sys/class/gpio/unexport