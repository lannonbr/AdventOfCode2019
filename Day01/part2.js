const fs = require("fs");
const path = require("path");
const sum = (acc, curr) => acc + curr;

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  const masses = buf.toString();

  const output = masses
    .split("\n")
    .map(Number)
    .map(mass => {
      let fuelSum = 0;
      let fuel = Math.floor(mass / 3) - 2;

      // total fuel is recursive sum of each Math.floor(fuel / 3) - 2 until the number goes to 0 or negative
      while (fuel > 0) {
        fuelSum += fuel;
        fuel = Math.floor(fuel / 3) - 2;
      }

      return fuelSum;
    })
    .reduce(sum, 0);

  console.log(output);
});

// Output: 5001791
