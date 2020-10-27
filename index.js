const MotorController = require('./motorController');

const step_pin = 14;

const direction_pin = 15;
const m1_pin = 17;
const m2_pin = 27;
const m3_pin = 22;


const motor = new MotorController(step_pin, direction_pin, m1_pin, m2_pin, m3_pin, true);
const moveIt = async (motor) => {
    const start = Date.now();
    await motor.moveMotor(360, 1, 500);
    const end = Date.now();
    console.log(`Time taken: ${end - start}`);
}

moveIt(motor);
