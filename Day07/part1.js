const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let program = buf
    .toString()
    .split(",")
    .map(Number);

  let originalProgram = [...program];

  let phaseSetting;
  let inputSignal = 0;
  let numRun = 0;

  let phaseSettingPerms = permutator([0, 1, 2, 3, 4]);

  let results = [];

  while (phaseSettingPerms.length > 0) {
    numRun = 0;
    inputSignal = 0;
    phaseSetting = phaseSettingPerms.pop();
    console.log("Phase Setting:", phaseSetting);
    while (numRun < 5) {
      inputSignal = calculate(program, phaseSetting, inputSignal, numRun);

      numRun++;
      program = [...originalProgram];
    }
    results.push({ inputSignal, phaseSetting });
  }

  results.sort((a, b) => a.inputSignal - b.inputSignal).reverse();

  console.log(results);
});

function parseOpCodeAndModes(num) {
  let numStr = num.toString();

  numStr = numStr.padStart(4, "0");

  let op = +numStr.slice(2);

  let param1Mode = +numStr[1];
  let param2Mode = +numStr[0];

  return { op, param1Mode, param2Mode };
}

const permutator = inputArr => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};

function calculate(program, phaseSetting, inputSignal, numRun) {
  let whichInput = 0;
  let i = 0;

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
      if (whichInput === 0) {
        program[program[i + 1]] = phaseSetting[numRun];
        whichInput = 1;
      } else {
        program[program[i + 1]] = inputSignal;
        whichInput = 0;
      }
      i += 2;
    } else if (op === 4) {
      // Output
      console.log(`[OUTPUT] ${program[program[i + 1]]}`);
      inputSignal = program[program[i + 1]];
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

  return inputSignal;
}
