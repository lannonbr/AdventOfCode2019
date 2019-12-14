const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let program = buf
    .toString()
    .split(",")
    .map(Number);

  let oldSize = program.length;

  program.length = oldSize * 10;

  for (let i = oldSize; i < program.length; i++) {
    program[i] = 0;
  }

  let i = 0;

  let input = 0;

  let x = 0;
  let y = 0;
  let tileId = 0;
  let outputCount = 0;
  let blockCount = 0;

  let relativePointer = 0;

  while (program[i] !== 99) {
    let { param1Mode, param2Mode, param3Mode, op } = parseOpCodeAndModes(
      program[i]
    );

    // 0 = position mode, if pos[i] === 4, go get value at index 4
    // 1 = immediate mode, if pos[i] === 4, use the literal value 4
    // 2 = relative mode, if pos[i] === 4 and relativePointer is 4, go get value at index 4+4 -> 8
    let param1, param2;

    switch (param1Mode) {
      case 0:
        param1 = program[program[i + 1]];
        break;
      case 1:
        param1 = program[i + 1];
        break;
      case 2:
        param1 = program[relativePointer + program[i + 1]];
        break;
    }

    switch (param2Mode) {
      case 0:
        param2 = program[program[i + 2]];
        break;
      case 1:
        param2 = program[i + 2];
        break;
      case 2:
        param2 = program[relativePointer + program[i + 2]];
        break;
    }

    if (op === 1) {
      // Add
      // console.log('ADD', param1, param2, program[i+3])
      program[program[i + 3] + (param3Mode ? relativePointer : 0)] =
        param1 + param2;
      i += 4;
    } else if (op === 2) {
      // Multiply
      program[program[i + 3] + (param3Mode ? relativePointer : 0)] =
        param1 * param2;
      i += 4;
    } else if (op === 3) {
      // Store
      if (param1Mode == 0) {
        program[program[i + 1]] = input;
      } else if (param1Mode == 2) {
        program[relativePointer + program[i + 1]] = input;
      }
      i += 2;
    } else if (op === 4) {
      // Output
      // console.log(`[OUTPUT] ${param1}`);
      if (outputCount === 0) {
        x = param1;
        outputCount++;
      } else if (outputCount === 1) {
        y = param1;
        outputCount++;
      } else if (outputCount === 2) {
        tileId = param1;
        console.log(x, y, tileId);
        if (tileId === 2) blockCount++;
        outputCount = 0;
      }
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
        program[program[i + 3] + (param3Mode ? relativePointer : 0)] = 1;
      } else {
        program[program[i + 3] + (param3Mode ? relativePointer : 0)] = 0;
      }
      i += 4;
    } else if (op === 8) {
      // equals
      if (param1 === param2) {
        program[program[i + 3] + (param3Mode ? relativePointer : 0)] = 1;
      } else {
        program[program[i + 3] + (param3Mode ? relativePointer : 0)] = 0;
      }
      i += 4;
    } else if (op === 9) {
      relativePointer += param1;
      i += 2;
    }
  }

  console.log(blockCount);
});

function parseOpCodeAndModes(num) {
  let numStr = num.toString();

  numStr = numStr.padStart(5, "0");

  let op = +numStr.slice(3);

  let param1Mode = +numStr[2];
  let param2Mode = +numStr[1];
  let param3Mode = +numStr[0];

  return { op, param1Mode, param2Mode, param3Mode };
}
