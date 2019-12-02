const fs = require("fs");
const path = require("path");

const resultNumber = 19690720;

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let program = buf
    .toString()
    .split(",")
    .map(Number);

  let runs = 0;

  for (let j = 0; j < 100; j++) {
    inner: for (let k = 0; k < 100; k++) {
      let currentProgram = [...program];
      let i = 0;

      currentProgram[1] = j;
      currentProgram[2] = k;

      while (currentProgram[i] !== 99) {
        let op = currentProgram[i];

        if (op === 1) {
          currentProgram[currentProgram[i + 3]] =
            currentProgram[currentProgram[i + 1]] +
            currentProgram[currentProgram[i + 2]];
        } else if (op === 2) {
          currentProgram[currentProgram[i + 3]] =
            currentProgram[currentProgram[i + 1]] *
            currentProgram[currentProgram[i + 2]];
        }

        i = i + 4;
      }

      runs++;

      if (
        !(
          currentProgram[0] > resultNumber - 100 &&
          currentProgram[0] < resultNumber + 100
        )
      ) {
        break inner;
      }

      if (currentProgram[0] === resultNumber) {
        console.log("pos 1", currentProgram[1]);
        console.log("pos 2", currentProgram[2]);
        console.log("runs", runs);
        console.log("answer", 100 * currentProgram[1] + currentProgram[2]);
        return;
      }
    }
  }
});
