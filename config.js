module.exports = {
  // Duration between actions in the bot. Sensor polling interval, if you like.
  // Too low (fast), and you don't have enough sensor data to act.
  // Too high (slow), and you react too sluggishly.
  // 50ms is a good number.
  clock: 50,  // milliseconds

  // This is the number of encoder notches, times 2.
  // It's multiplied by 2 since we get interrupts for both the
  // rising and falling edges of the encoder transition.
  encoderTicksPerRotation: 40,

  // Various aspects of the physical dimensions of the robot geometry.
  // You might want to tweak these values to better suit your bot.
  // Getting this right is kinda important, so it's worth fiddling with
  // these values. Parameters are easy to measure using just a ruler.
  // All dimensions in mm.
  wheelbase: 140,   // distance between the centres of the wheels

  wheels: {
    left: { diameter: 67 },
    right: { diameter: 67 },
  },

  // Slew rate is the maximum allowable change in the mtor PWM
  // per config.clock ms. It helps prevent ubrupt changes to the motor speeds,
  // increasing life of the motors and gearboxes, and makes the bot more
  // graceful. Setting it too low makes the robot sluggish though.
  enableSlew: true,
  slewRate: 10,

  topSpeed: 3000 //3350
}
