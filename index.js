const { MotorCotroller } = require('./motorController');
const MotorController = require('./motorController');

const step_pin = 0;
const direction_pin = 0;
const ms1_pin = 0;
const ms2_pin = 0;
const ms3_pin = 0;

const motor = new MotorController(step_pin, direction_pin, ms1_pin, ms2_pin, ms3_pin);

motor.moveMotor(180, true, 1000);