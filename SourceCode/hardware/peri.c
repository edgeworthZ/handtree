#include <avr/io.h>
#include "peri.h"

void init_peri()
{
    // PC0..PC2 -> output
    DDRC |= (1<<PC2)|(1<<PC1)|(1<<PC0);
    DDRB |= (1<<PB2);

    // PC3,PC4 -> input
    DDRC &= ~((1<<PC3)|(1<<PC4));
    DDRB &= ~((1<<PB0)|(1<<PB1)|(1<<PB4)|(1<<PB5));

    // enable pull-up resistor on PC3
    PORTC |= (1<<PC3);
    PORTB |= (1<<PB0)|(1<<PB1)|(1<<PB4)|(1<<PB5);

    // turn off all LEDs
    set_led_value(0);
    set_led_b(1);
}

void set_led_b(uint8_t state)
{
    if(state)
      PORTB |= (1<<PB2);
    else
      PORTB &= ~(1<<PB2);
}