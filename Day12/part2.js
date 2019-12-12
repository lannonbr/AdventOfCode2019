const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let moons = buf
    .toString()
    .split("\n")
    .map(moon => {
      return moon
        .slice(1, -1)
        .split(", ")
        .map(val => {
          let pair = val.split("=");
          pair[1] = +pair[1];
          return pair;
        });
    })
    .map(Object.fromEntries)
    .map(moon => {
      moon.velX = 0;
      moon.velY = 0;
      moon.velZ = 0;

      return moon;
    });

  let stepLenX = 0;
  let stepLenY = 0;
  let stepLenZ = 0;

  let origX = moons.map(m => m.x);
  let origY = moons.map(m => m.y);
  let origZ = moons.map(m => m.z);

  // Run each axis seprately and stop each axis when you return to the starting
  // point with a velocity of 0
  do {
    moons = stepAxis(moons, "x");
    stepLenX++;
  } while (!orig(moons, origX, "x"));

  do {
    moons = stepAxis(moons, "y");
    stepLenY++;
  } while (!orig(moons, origY, "y"));

  do {
    moons = stepAxis(moons, "z");
    stepLenZ++;
  } while (!orig(moons, origZ, "z"));

  console.log("X:", stepLenX);
  console.log("Y:", stepLenY);
  console.log("Z:", stepLenZ);

  // Rather than find a LCM library or write a function to do it, just use Wolfram Alpha
  console.log(
    `https://www.wolframalpha.com/input/?i=lcm%28${stepLenX}%2C${stepLenY}%2C${stepLenZ}%29`
  );
});

function stepAxis(moons, axis) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = 0; j < moons.length; j++) {
      if (i !== j) {
        calculateVelocity(moons[i], moons[j], axis);
      }
    }
  }

  for (let moon of moons) {
    moon[axis] += moon[`vel${axis.toUpperCase()}`];
  }

  return moons;
}

function calculateVelocity(moonA, moonB, axis) {
  moonA[`vel${axis.toUpperCase()}`] +=
    -1 * Math.sign(moonA[axis] - moonB[axis]);
}

// Check if the moons are at the same spot as they started
function orig(moons, original, axis) {
  let now = moons.map(m => m[axis]);

  for (let i = 0; i < 4; i++) {
    if (moons[i][`vel${axis.toUpperCase()}`] !== 0) return false;
    if (now[i] !== original[i]) {
      return false;
    }
  }

  return true;
}
