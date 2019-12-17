const fs = require("fs");
const path = require("path");
const clear = require("clear");

fs.promises.readFile(path.join(__dirname, "grid.txt")).then(async buf => {
  let grid = buf.toString().split("\n");

  let gridSize = 41;
  let oxygenStation = [33, 35, 0];
  let movers = [oxygenStation];
  let nextMovers = [];
  let maxLength = 0;

  grid = grid.join("").split("");

  while (movers.length > 0) {
    nextMovers = [];

    for (let mover of movers) {
      tryPos(mover, mover[0], mover[1] - 1, "up");
      tryPos(mover, mover[0] + 1, mover[1], "right");
      tryPos(mover, mover[0], mover[1] + 1, "down");
      tryPos(mover, mover[0] - 1, mover[1], "left");
    }
    movers = nextMovers;
    printGrid(grid);

    // Sleep for 20ms
    await new Promise(resolve => setTimeout(() => resolve(), 20));

    // get max of all current movers & the current max length
    maxLength = movers.reduce(
      (acc, mover) => (mover[2] > acc ? mover[2] : acc),
      maxLength
    );

    console.log("max len:", maxLength);
    clear();
  }
  printGrid(grid);
  console.log("max len:", maxLength);

  function tryPos(mover, x, y, dir) {
    let newPos = [x, y];
    if (grid[newPos[1] * gridSize + newPos[0]] === ".") {
      console.log(newPos, `${dir} is an available point`);
      nextMovers.push([...newPos, mover[2] + 1]);
      grid[newPos[1] * gridSize + newPos[0]] = "X";
    }
  }

  function printGrid(grid) {
    for (let i = 0; i < gridSize; i++) {
      console.log(grid.slice(gridSize * i, gridSize * i + gridSize).join(""));
    }
  }
});
