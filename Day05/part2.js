const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let program = buf
    .toString()
    .split(",")
    .map(Number);

  let i = 0;

  let input = 5;

  while (program[i] !== 99) {
    let { param1Mode, param2Mode, op } = parseOpCodeAndModes(program[i]);

    // 0 = position mode, if pos[i] === 4, go get value at index 4
    // 1 = immediate mode, if pos[i] === 4, use the literal value 4
    let param1 = param1Mode ? program[i + 1] : program[program[i + 1]];
    let param2 = param2Mode ? program[i + 2] : program[program[i + 2]];

    if (op === 1) {
      // Add
      program[program[i + 3]] = param1 + param2;
      i += 4;
    } else if (op === 2) {
      // Multiply
      program[program[i + 3]] = param1 * param2;
      i += 4;
    } else if (op === 3) {
      // Store
      program[program[i + 1]] = input;
      i += 2;
    } else if (op === 4) {
      // Output
      console.log(`[OUTPUT] ${program[program[i + 1]]}`);
      i += 2;
    } else if (op === 5) {
      // Jump if non-zero
      if (param1 !== 0) {
        i = param2;
      } else {
        i += 3;
      }
    } else if (op === 6) {
      // jump if 0
      if (param1 === 0) {
        i = param2;
      } else {
        i += 3;
      }
    } else if (op === 7) {
      // less-than
      if (param1 < param2) {
        program[program[i + 3]] = 1;
      } else {
        program[program[i + 3]] = 0;
      }
      i += 4;
    } else if (op === 8) {
      // equals
      if (param1 === param2) {
        program[program[i + 3]] = 1;
      } else {
        program[program[i + 3]] = 0;
      }
      i += 4;
    }
  }
});

function parseOpCodeAndModes(num) {
  let numStr = num.toString();

  numStr = numStr.padStart(4, "0");

  let op = +numStr.slice(2);

  let param1Mode = +numStr[1];
  let param2Mode = +numStr[0];

  return { op, param1Mode, param2Mode };
}
