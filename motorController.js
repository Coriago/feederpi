const gpio = require('rpi-gpio').promise;

const INITIAL_DELAY = 50;
const DEGREE_PER_STEP = 1.8;
const DEGREES_PER_REV = 360;
const MS_PER_MIN = 60000;
const MAX_RPM = 60;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getResolution = (type) => {
    const resolutions = {
        Full: [0, 0, 0],
        Half: [1, 0, 0],
        Quarter: [0, 1, 0],
        Eighth: [1, 1, 0],
        Sixteenth: [1, 1, 1]
    }
    if(!(type in resolutions)) throw new Error('Incorrect type given')
    return resolutions[type];
}

class MotorController {
    /**
     * Creates a motor controller
     * @param {int} step_pin 
     * @param {int} direction_pin 
     * @param {int} Mode_pin1 
     * @param {int} Mode_pin2 
     * @param {int} Mode_pin3 
     * @param {bool} verbose 
     */
    constructor(step_pin, direction_pin, Mode_pin1, Mode_pin2, Mode_pin3, verbose) {
        this.step_pin = step_pin;
        this.direction_pin = direction_pin;
        this.Mode_pin1 = Mode_pin1;
        this.Mode_pin2 = Mode_pin2;
        this.Mode_pin3 = Mode_pin3;
        this.verbose = verbose;
    }

    /**
     * Moves the motor using degrees direction and time
     * @param {int} degrees 
     * @param {bool} direction true: CW false: CCW
     * @param {int} time 
     */
    moveMotor = async (degrees, direction, time) => {
        // Speed Bounds
        const maxDegreesPerMs = (MAX_RPM * DEGREES_PER_REV) / MS_PER_MIN;
        if ((degrees / time) > maxDegreesPerMs) throw new Error('Motor movement too fast');

        // Initial Step calulation
        const sixteenthDegrees = DEGREE_PER_STEP / 16;
        const sixteenthSteps = Math.floor(degrees / sixteenthDegrees);
        let stepType = 'Sixteenth';
        let steps = sixteenthSteps;

        // Finds most efficient step type
        if (sixteenthSteps % 16 == 0) {
            stepType = 'Full';
            steps = sixteenthSteps / 16;
        } else if (sixteenthSteps % 8 == 0) {
            stepType = 'Half';
            steps = sixteenthSteps / 8;
        } else if (sixteenthSteps % 4 == 0) {
            stepType = 'Quarter';
            steps = sixteenthSteps / 4;
        } else if (sixteenthSteps % 2 == 0) {
            stepType = 'Eighth';
            steps = sixteenthSteps / 2;
        }

        const timePerStep = time / steps;
        const delay = timePerStep / 2;
        
        await this.moveMotorComplex(steps, direction, delay, stepType);
    }

    /**
     * Moves the motor using more complex params
     * @param {int} steps 
     * @param {bool} direction true: CW false: CCW
     * @param {int} delay 
     * @param {string} stepType 
     */
    moveMotorComplex = async (steps, direction, delay, stepType) => {
        // Get Resolution
        const res = getResolution(stepType);

        // Set Pins
        try{
            await gpio.setup(this.step_pin);
            if(res[0]) await gpio.setup(this.Mode_pin1, gpio.DIR_HIGH);
            if(res[1]) await gpio.setup(this.Mode_pin2, gpio.DIR_HIGH);
            if(res[2]) await gpio.setup(this.Mode_pin3, gpio.DIR_HIGH);
            if (direction) await gpio.setup(this.direction_pin, gpio.DIR_HIGH);
        } catch(err) {
            console.log('Failed to setup GPIO');
            await gpio.destroy();
            throw err;
        }

        // Initial Sleep
        await sleep(INITIAL_DELAY);

        // Perform Steps
        try{
            for(let i = 0; i < steps; i++) {
                gpio.write(this.step_pin, true).then(() => sleep(delay));
                gpio.write(this.step_pin, false).then(() => sleep(delay));
            }
        } catch(err) {
            console.log('Failed to perform steps');
            gpio.destroy();
            throw err;
        }

        // Clean up
        await gpio.destroy();
    }
}

module.exports = MotorController;