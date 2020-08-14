const MotorController = require('./motorController');

const step_pin = 4;
const direction_pin = 23;
const m1_pin = 17;
const m2_pin = 27;
const m3_pin = 22;


const motor = new MotorController(step_pin, direction_pin, m1_pin, m2_pin, m3_pin, true);

await motor.moveMotor(180, 1, 1500);
console.log('Async working?')
