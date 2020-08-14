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

gpio.setup(7, gpio.DIR_OUT, write);

function write(err) {
    if (err) throw err;
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}