import usb

RQ_GET_ULTRA     = 0
RQ_GET_SWITCH1   = 1
RQ_GET_SWITCH2   = 2
RQ_GET_SWITCH3   = 3
RQ_GET_SWITCH4   = 4
RQ_ACTIVATE_PUMP = 5
RQ_DEACTIVATE_PUMP = 6
RQ_SET_LED_B     = 7

####################################
def find_mcu_boards():
    '''
    Find all Practicum MCU boards attached to the machine, then return a list
    of USB device handles for all the boards

    >>> devices = find_mcu_boards()
    >>> first_board = McuBoard(devices[0])
    '''
    boards = [dev for bus in usb.busses()
                  for dev in bus.devices
                  if (dev.idVendor,dev.idProduct) == (0x16c0,0x05dc)]
    return boards

####################################
class McuBoard:
    '''
    Generic class for accessing Practicum MCU board via USB connection.
    '''

    ################################
    def __init__(self, dev):
        self.device = dev
        self.handle = dev.open()

    ################################
    def usb_write(self, request, data=[], index=0, value=0):
        '''
        Send data output to the USB device (i.e., MCU board)
           request: request number to appear as bRequest field on the USB device
           index: 16-bit value to appear as wIndex field on the USB device
           value: 16-bit value to appear as wValue field on the USB device
        '''
        reqType = usb.TYPE_VENDOR | usb.RECIP_DEVICE | usb.ENDPOINT_OUT
        self.handle.controlMsg(
                reqType, request, data, value=value, index=index)

    ################################
    def usb_read(self, request, length=1, index=0, value=0):
        '''
        Request data input from the USB device (i.e., MCU board)
           request: request number to appear as bRequest field on the USB device
           length: number of bytes to read from the USB device
           index: 16-bit value to appear as wIndex field on the USB device
           value: 16-bit value to appear as wValue field on the USB device

        If successful, the method returns a tuple of length specified
        containing data returned from the MCU board.
        '''
        reqType = usb.TYPE_VENDOR | usb.RECIP_DEVICE | usb.ENDPOINT_IN
        buf = self.handle.controlMsg(
                reqType, request, length, value=value, index=index)
        return buf


####################################
class PeriBoard:

    ################################
    def __init__(self, mcu):
        self.mcu = mcu


	################################
    def set_led_b(self, value):
        self.mcu.usb_write(RQ_SET_LED_B, value=value)

    ################################
    def get_switch(self):
        '''
        Return a boolean value indicating whether the switch on the peripheral
        board is currently pressed
        '''
        state = self.mcu.usb_read(RQ_GET_SWITCH, length=1)[0]
        return (state != 0)

	################################
    def get_switch1(self):
        state = self.mcu.usb_read(RQ_GET_SWITCH1,length=1)[0]
        return (state != 0)

	################################
    def get_switch2(self):
        state = self.mcu.usb_read(RQ_GET_SWITCH2,length=1)[0]
        return (state != 0)

	################################
    def get_switch3(self):
        state = self.mcu.usb_read(RQ_GET_SWITCH3,length=1)[0]
        return (state != 0)

	################################
    def get_switch4(self):
        state = self.mcu.usb_read(RQ_GET_SWITCH4,length=1)[0]
        return (state != 0)

	################################
    def get_ultra(self):
        state = self.mcu.usb_read(RQ_GET_ULTRA, length=1)[0]
        return (state != 0)

	################################
    def activate_pump(self):
        self.mcu.usb_write(RQ_ACTIVATE_PUMP,value=1)

	################################
    def deactivate_pump(self):
        self.mcu.usb_write(RQ_DEACTIVATE_PUMP,value=0)
