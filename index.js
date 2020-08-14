
const step_pin = 18;
const direction_pin = 16;
const ms1_pin = 36;
const ms2_pin = 38;
const ms3_pin = 40;

//const motor = new MotorController(step_pin, direction_pin, ms1_pin, ms2_pin, ms3_pin);

//motor.moveMotor(180, true, 1000);



const Gpio = require('../onoff').Gpio; // Gpio class
const led = new Gpio(17, 'out');       // Export GPIO17 as an output
let stopBlinking = false;
 
// Toggle the state of the LED connected to GPIO17 every 200ms
const blinkLed = _ => {
  if (stopBlinking) {
    return led.unexport();
  }
 
  led.read()
    .then(value => led.write(value ^ 1))
    .then(_ => setTimeout(blinkLed, 200))
    .catch(err => console.log(err));
};
 
blinkLed();
 
// Stop blinking the LED after 5 seconds
setTimeout(_ => stopBlinking = true, 5000);
