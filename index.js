const MotorController = require('./motorController');

const step_pin = 14;

const direction_pin = 15;
const m1_pin = 17;
const m2_pin = 27;
const m3_pin = 22;


const motor = new MotorController(step_pin, direction_pin, m1_pin, m2_pin, m3_pin, true);
const start = performance.now();
motor.moveMotor(720, 1, 2500);
const end = performance.now();

console.log(`Time taken: ${end - start}`);
