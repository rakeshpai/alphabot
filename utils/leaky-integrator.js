// Imagine a container of water, with a tap at the bottom.
// You can `.add` any amount of water to the container, and you can
// `.leak` any amount of water you like.
// You can check the `.level` of the container to see how much
// it has filled up.

// Useful to check if you're stuck doing something for too long
// Keep draining a small amount from the container every tick,
// and add a larger amount to it when you're doing something wrong.
// When the `.level` hits a threshold, you know you've been trying
// a bad strategy for too long now, and you can initiate a different
// sequence to get out of trouble.

module.exports = () => {
  let value = 0;
  
  return {
    leak: amount => {
      value -= amount;
      if(value < 0) value === 0;
    },
    
    add: amount => value += amount,
    
    level: () => value
  }
}