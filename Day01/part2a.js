// Part 2, but replace some of the loop with a generator function

const fs = require("fs");
const path = require("path");
const sum = (acc, curr) => acc + curr;

function* generator(i) {
  let n = i;
  while (true) {
    n = Math.floor(n / 3) - 2;
    yield n;
  }
}

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  const masses = buf.toString();

  const output = masses
    .split("\n")
    .map(Number)
    .map(mass => {
      let fuelSum = 0;
      let gen = generator(mass);

      let fuel = gen.next().value;

      // total fuel is recursive sum of each Math.floor(fuel / 3) - 2 until the number goes to 0 or negative
      while (fuel > 0) {
        fuelSum += fuel;
        fuel = gen.next().value;
      }

      return fuelSum;
    })
    .reduce(sum, 0);

  console.log(output);
});

// Output: 5001791
