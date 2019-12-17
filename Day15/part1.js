const fs = require("fs");
const path = require("path");
const readlineSync = require("readline-sync");

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

  // place in around middle of the grid
  let x = 25;
  let y = 25;

  // Make reasonably large grid
  let gridSize = 64;

  let grid = [];
  grid.length = gridSize ** 2;

  let wall = "#";
  let empty = ".";
  let you = "O";
  let unvisited = " ";
  let oxygen = "X";

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i * gridSize + j] = unvisited;
    }
  }

  grid[y * gridSize + x] = you;

  function printGrid(grid) {
    for (let i = 0; i < gridSize; i++) {
      console.log(grid.slice(gridSize * i, gridSize * i + gridSize).join(""));
    }
  }

  function getUpcomingPosition(dir) {
    let newX = x;
    let newY = y;

    if (dir === 1) {
      // north
      newY--;
    } else if (dir === 2) {
      // south
      newY++;
    } else if (dir === 3) {
      // west
      newX--;
    } else if (dir === 4) {
      // east
      newX++;
    }

    return [newX, newY];
  }

  let i = 0;

  let dir;

  let oxygenPoint = [];

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
      printGrid(grid);

      let f = readlineSync.keyIn("Where to next? (wasd to move, q to quit)");

      if (f === "w") dir = 1;
      if (f === "s") dir = 2;
      if (f === "a") dir = 3;
      if (f === "d") dir = 4;
      if (f === "q") process.exit(0);

      if (param1Mode == 0) {
        program[program[i + 1]] = dir;
      } else if (param1Mode == 2) {
        program[relativePointer + program[i + 1]] = dir;
      }

      i += 2;
    } else if (op === 4) {
      // Output
      console.log(`[OUTPUT] ${param1}`);

      let [newX, newY] = getUpcomingPosition(dir);

      if (param1 === 0) {
        grid[newY * gridSize + newX] = wall;
      } else if (param1 === 1 || param1 === 2) {
        grid[y * gridSize + x] = empty;

        if (
          oxygenPoint.length === 2 &&
          oxygenPoint[0] === x &&
          oxygenPoint[1] === y
        ) {
          grid[y * gridSize + x] = oxygen;
        }

        x = newX;
        y = newY;

        grid[y * gridSize + x] = you;

        if (param1 === 2) {
          console.log("FOUND OXYGEN");
          console.log(x, y);
          process.exit(0);
        }
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
      // console.log('EQ', param1, param2, program[i+3])
      if (param1 === param2) {
        program[program[i + 3] + (param3Mode ? relativePointer : 0)] = 1;
      } else {
        program[program[i + 3] + (param3Mode ? relativePointer : 0)] = 0;
      }
      i += 4;
    } else if (op === 9) {
      // console.log(`Setting relativePointer ${relativePointer} + ${param1} = ${relativePointer + param1}`)
      relativePointer += param1;
      i += 2;
    }
  }
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
