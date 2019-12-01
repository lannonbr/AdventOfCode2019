const fs = require("fs");
const path = require("path");
const sum = (acc, curr) => acc + curr;

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  const masses = buf.toString();

  const output = masses
    .split("\n")
    .map(Number)
    .map(mass => Math.floor(mass / 3) - 2)
    .reduce(sum, 0);

  console.log(output);
});

// Output: 3336439
