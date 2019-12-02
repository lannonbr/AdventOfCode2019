// Even further optimization where I do two binary searches to find the values of pos 1 and pos 2.

const fs = require("fs");
const path = require("path");

const resultNumber = 19690720;

function calc(program, j, k) {
  let i = 0;

  program[1] = j;
  program[2] = k;

  while (program[i] !== 99) {
    let op = program[i];

    if (op === 1) {
      program[program[i + 3]] =
        program[program[i + 1]] + program[program[i + 2]];
    } else if (op === 2) {
      program[program[i + 3]] =
        program[program[i + 1]] * program[program[i + 2]];
    }

    i = i + 4;
  }

  return program[0];
}

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let program = buf
    .toString()
    .split(",")
    .map(Number);

  let runs = 0;

  // bounds for the binary searches
  let jBounds = [0, 99];
  let kBounds = [0, 99];

  // start at the midpoint of the bounds
  let j = 50;
  let k = 50;

  while (true) {
    let currentProgram = [...program];
    let result = calc(currentProgram, j, k);

    runs++;

    if (result < resultNumber - 100) {
      jBounds[0] = j;
      j += Math.round((jBounds[1] - j) / 2);
    } else if (result > resultNumber + 100) {
      jBounds[1] = j;
      j -= Math.round((j - jBounds[0]) / 2);
    } else {
      while (true) {
        let currentProgram = [...program];
        let result = calc(currentProgram, j, k);

        runs++;

        if (result < resultNumber) {
          kBounds[0] = k;
          k += Math.round((kBounds[1] - k) / 2);
        } else if (result > resultNumber) {
          kBounds[1] = k;
          k -= Math.round((k - kBounds[0]) / 2);
        } else {
          console.log("pos 1", j);
          console.log("pos 2", k);
          console.log("runs", runs);
          console.log("answer", 100 * currentProgram[1] + currentProgram[2]);
          process.exit(0);
        }
      }
    }
  }
});
