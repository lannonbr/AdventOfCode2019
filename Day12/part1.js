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

  for (let s = 0; s < 1000; s++) {
    moons = step(moons);
  }

  calculateEnergy(moons);
});

function step(moons) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = 0; j < moons.length; j++) {
      if (i !== j) {
        calculateVelocity(moons[i], moons[j]);
      }
    }
  }

  for (let moon of moons) {
    moon.x += moon.velX;
    moon.y += moon.velY;
    moon.z += moon.velZ;
  }

  return moons;
}

function calculateVelocity(moonA, moonB) {
  moonA.velX += -1 * Math.sign(moonA.x - moonB.x);
  moonA.velY += -1 * Math.sign(moonA.y - moonB.y);
  moonA.velZ += -1 * Math.sign(moonA.z - moonB.z);
}

function calculateEnergy(moons) {
  let totalEnergy = moons.reduce((acc, moon) => {
    let potentialEnergy =
      Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
    let kineticEnergy =
      Math.abs(moon.velX) + Math.abs(moon.velY) + Math.abs(moon.velZ);

    return acc + potentialEnergy * kineticEnergy;
  }, 0);

  console.log(totalEnergy);
}
