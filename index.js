var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
  console.log('Channel ' + channel + ' value is now ' + value);
  gpio.destroy();
});

function write(err) {
    if (err) throw err;
    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}

gpio.setup(7, gpio.DIR_OUT, gpio.EDGE_BOTH, write);