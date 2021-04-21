#define SWITCH_PRESSED() ((PINC & (1<<PC3)) == 0)
#define SWITCH1_PRESSED() ((PINB & (1<<PB0)) == 0)
#define SWITCH2_PRESSED() ((PINB & (1<<PB1)) == 0)
#define SWITCH3_PRESSED() ((PINB & (1<<PB4)) == 0)
#define SWITCH4_PRESSED() ((PINB & (1<<PB5)) == 0)

void init_peri();
void set_led_b(uint8_t pin, uint8_t state);
