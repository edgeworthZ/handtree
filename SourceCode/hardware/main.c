/********************************************************************
Credit: AVINASH GUPTA (PulseIn from Arduino into C Code)
********************************************************************/

#include <avr/io.h>
#include <avr/interrupt.h>  /* for sei() */
#include <util/delay.h>     /* for _delay_ms() */
#include <avr/pgmspace.h>   /* required by usbdrv.h */

#include "peri.h"
#include "usbdrv.h"

#define US_PORT PORTC
#define	US_PIN	PINC
#define US_DDR 	DDRC

#define US_TRIG_POS	PC3
#define US_ECHO_POS	PC4
#define PM_SW_POS     PC5
#define US_ERROR	-1
#define	US_NO_OBSTACLE	-2


#define RQ_GET_ULTRA       0
#define RQ_GET_SWITCH1     1
#define RQ_GET_SWITCH2     2
#define RQ_GET_SWITCH3     3
#define RQ_GET_SWITCH4     4
#define RQ_ACTIVATE_PUMP   5
#define RQ_DEACTIVATE_PUMP 6
#define RQ_SET_LED_B       7

void sonicInit();
void pumpInit();
void sonicTrigger();
void pumpActivate();
void pumpDeactivate();

void sonicInit()
{
	US_DDR|=(1<<US_TRIG_POS);
}

void pumpInit()
 {
  US_DDR|=(1<<PM_SW_POS);
 }


void pumpActivate()
{
  US_PORT|=(1<<PM_SW_POS); //high
}

void pumpDeactivate()
{
  US_PORT&=~(1<<PM_SW_POS); //low
}

void sonicTrigger()
{	
	US_PORT|=(1<<US_TRIG_POS);	//high
	_delay_us(15);			
	US_PORT&=~(1<<US_TRIG_POS); //low
}

uint16_t getPulseWidth(uint8_t US_ECHO_POS)
{
	uint32_t i,result;
    int sig = 600000;

	//Wait for the rising edge
	for(i=0;i<sig;i++)
	{
		if(!(US_PIN & (1<<US_ECHO_POS))) 
			continue; //Line is still low, so wait
		else 
			break; //High edge detected, so break.
	}

	if(i==sig) return US_ERROR; //Indicates time out
	
	//High Edge Found

	//Setup Timer1
	TCCR1A=0X00;
	TCCR1B=(1<<CS11); //Prescaler = Fcpu/8
	TCNT1=0x00; //Init counter

	//Now wait for the falling edge
	for(i=0;i<sig;i++)
	{
		if(US_PIN & (1<<US_ECHO_POS))
		{
			if(TCNT1 > sig) break; else continue;
		}
		else
			break;
	}

	if(i==sig)
		return US_NO_OBSTACLE; //Indicates time out

	//Falling edge found
	result=TCNT1;

	//Stop Timer
	TCCR1B=0x00;

	if(result > sig)
		return US_NO_OBSTACLE; //No obstacle
	else
		return (result>>1);
}

/* ------------------------------------------------------------------------- */
/* ----------------------------- USB interface ----------------------------- */
/* ------------------------------------------------------------------------- */
usbMsgLen_t usbFunctionSetup(uint8_t data[8])
{
    usbRequest_t *rq = (void *)data;

    /* declared as static so they stay valid when usbFunctionSetup returns */
    static uint8_t switch1_state;
    static uint8_t switch2_state;
    static uint8_t switch3_state;
    static uint8_t switch4_state;
    static uint8_t ultra_state;
    static uint16_t light_value;

    if (rq->bRequest == RQ_SET_LED_B)
    {
      uint8_t led_value = rq->wValue.bytes[0];
      set_led_b(led_value);
      return 0;
    }
    else if (rq->bRequest == RQ_GET_SWITCH1){
        switch1_state = SWITCH1_PRESSED();
        usbMsgPtr = &switch1_state;
        return 1;
    }
    else if (rq->bRequest == RQ_GET_SWITCH2){
        switch2_state = SWITCH2_PRESSED();
        usbMsgPtr = &switch2_state;
        return 1;
    }
    else if (rq->bRequest == RQ_GET_SWITCH3){
        switch3_state = SWITCH3_PRESSED();
        usbMsgPtr = &switch3_state;
        return 1;
    }
    else if (rq->bRequest == RQ_GET_SWITCH4){
        switch4_state = SWITCH4_PRESSED();
        usbMsgPtr = &switch4_state;
        return 1;
    }
    else if (rq->bRequest == RQ_GET_LIGHT)
    {
        light_value = read_adc(PC4);
        usbMsgPtr = (uchar*) &light_value;
        return sizeof(light_value);
    }
    else if (rq->bRequest == RQ_GET_ULTRA)
    {
        uint16_t r1;
        sonicTrigger();
        r1 = getPulseWidth(US_ECHO_POS);
        int d1;
        d1 = r1/58.0;
        if(d1 >= 0 && d1 < 10){
          ultra_state = 0b001;
        }else{
          ultra_state = 0b000;
        }
        usbMsgPtr = &ultra_state;
        return 1;
    }
    else if (rq->bRequest == RQ_ACTIVATE_PUMP)
    {
        pumpActivate();
        return 1;
    }
    else if (rq->bRequest == RQ_DEACTIVATE_PUMP)
    {
        pumpDeactivate();
        return 0;
    }

    /* default for not implemented requests: return no data back to host */
    return 0;
}

/* ------------------------------------------------------------------------- */
int main(void)
{
    init_peri();
    usbInit();
    sonicInit();
    pumpInit();

    /* enforce re-enumeration, do this while interrupts are disabled! */
    usbDeviceDisconnect();
    _delay_ms(300);
    usbDeviceConnect();

    /* enable global interrupts */
    sei();

    /* main event loop */
    for(;;)
    {
       usbPoll();
    }

    return 0;
}

/* ------------------------------------------------------------------------- */