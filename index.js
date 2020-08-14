var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const led = new Gpio(4, 'out');       // Export GPIO17 as an output
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