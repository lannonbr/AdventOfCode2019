const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let program = buf
    .toString()
    .split(",")
    .map(Number);

  let i = 0;

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

  console.log(program[0]);
});
