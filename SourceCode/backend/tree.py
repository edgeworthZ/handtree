from practicum import find_mcu_boards, McuBoard, PeriBoard
from time import sleep
import requests
import schedule
import time

isWashing = False
switchAvailable = False

def newDayEvent():
    r = requests.patch('http://192.168.1.8:55554/tree/dailyreset')
    print(r.text)
    users = ['user1','user2','user3','user4']
    for user in users:
        r = requests.patch('http://192.168.1.8:55554/tree/updateday/'+user)
        print(r.text)

def washEvent(user):
    global switchAvailable
    if switchAvailable is False:
        return
    peri.set_led_b(1)
    sleep(0.1)
    peri.set_led_b(0)
    switchAvailable = False
    r = requests.patch('http://192.168.1.8:55554/tree/wash/'+user)
    print(r.text)

devs = find_mcu_boards()

if len(devs) == 0:
    print("*** No practicum board found.")
    exit(1)

mcu = McuBoard(devs[0])
print("*** Practicum board found")
print("*** Manufacturer: %s" % \
        mcu.handle.getString(mcu.device.iManufacturer, 256))
print("*** Product: %s" % \
        mcu.handle.getString(mcu.device.iProduct, 256))
peri = PeriBoard(mcu)

count = 0
schedule.every(24).hour.do(job)

while True:
    peri.set_led_value(count)
    sw1 = peri.get_switch1()
    sw2 = peri.get_switch2()
    sw3 = peri.get_switch3()
    sw4 = peri.get_switch4()
    ultra = peri.get_ultra()

    if sw1 is True:
        state1 = "PRESSED"
        washEvent('user1')
    else:
        state1 = "RELEASED"

    if sw2 is True:
        state2 = "PRESSED"
        washEvent('user2')
    else:
        state2 = "RELEASED"

    if sw3 is True:
        state3 = "PRESSED"
        washEvent('user3')
    else:
        state3 = "RELEASED"

    if sw4 is True:
        state4 = "PRESSED"
        washEvent('user4')
    else:
        state4 = "RELEASED"

    if ultra is True:
        u_state = "IN-RANGE"
        peri.activate_pump()
        isWashing = True
    else:
        if isWashing is True:
            switchAvailable = True
        isWashing = False
        u_state = "NOT-IN-RANGE"
        peri.deactivate_pump()

    print("SW1: %-8s | SW2: %-8s | SW3: %-8s | SW4 %-8s | Ultra state: %-12s" % ( state1, state2, state3, state4, u_state))

    count = (count + 1) % 8
    schedule.run_pending()
    sleep(0.1)


