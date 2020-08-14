const { MotorCotroller } = require('./motorController');
const gpio = require('rpi-gpio').promise;
const MotorController = require('./motorController');

const step_pin = 18;
const direction_pin = 16;
const ms1_pin = 36;
const ms2_pin = 38;
const ms3_pin = 40;

//const motor = new MotorController(step_pin, direction_pin, ms1_pin, ms2_pin, ms3_pin);

//motor.moveMotor(180, true, 1000);

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

gpio.setup(this.step_pin).then(() => {
  gpio.write(this.step_pin, true).then(() => sleep(delay));
  gpio.write(this.step_pin, false).then(() => sleep(delay));
});