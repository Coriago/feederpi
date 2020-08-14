var Gpio = require('onoff').Gpio;

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
        if(this.verbose) this.printPins();
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

    printPins = () => {
        console.log(`Step Pin: ${this.step_pin}\nDirection Pin: ${this.direction_pin}\nMode 1 Pin: ${this.Mode_pin1}\nMode 2 Pin: ${this.Mode_pin2}\nMode 3 Pin: ${this.Mode_pin3}`)
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
        if (this.verbose) console.log(`Running motor with steps: ${steps} direction: ${direction} delay: ${delay} and step type ${stepType}`);
        try {
            // Set Pins
            const step_gpio = new Gpio(this.step_pin, 'out');
            const direction_gpio = new Gpio(this.direction_pin, 'out');
            const mode1_gpio = new Gpio(this.Mode_pin1, 'out');
            const mode2_gpio = new Gpio(this.Mode_pin2, 'out');
            const mode3_gpio = new Gpio(this.Mode_pin3, 'out');
            direction_gpio.writeSync(direction);
            mode1_gpio.writeSync(res[0]);
            mode2_gpio.writeSync(res[1]);
            mode3_gpio.writeSync(res[2]);

            const cleanUp = () => {
                if (this.verbose) {
                    console.log('Finished motor command exporting pins:');
                    this.printPins();
                }
                step_gpio.unexport();
                direction_gpio.unexport();
                mode1_gpio.unexport();
                mode2_gpio.unexport();
                mode3_gpio.unexport();
                if (this.verbose) console.log('Finished clean up');
            }

            const step_act = async (count, value) => {
                count++;
                if(this.verbose) console.log(`Step: ${count}`);
                if (count == steps) return true;
                await sleep(delay);
                step_gpio.write(value).then(() => step_act(count, value ^ 1));
            }

            // Initial Sleep
            await sleep(INITIAL_DELAY);
            // Perform Steps
            await step_act(0,0);
            await cleanUp();

        } catch (err) {
            console.log('Failure while running trying to run motor');
            console.log(err);
            throw err;
        }
    }
}

module.exports = MotorController;