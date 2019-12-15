const fs = require("fs");
const path = require("path");

let reactionsMap = {};
let storage = {};

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  buf
    .toString()
    .split("\n")
    .map(reaction => {
      return reaction.split(" => ");
    })
    .forEach(reaction => {
      let ingredients = reaction[0].split(", ").map(input => {
        let [amt, name] = input.split(" ");
        return { amt: +amt, name };
      });

      let [amt, name] = reaction[1].split(" ");
      reactionsMap[name] = { amt: +amt, ingredients };

      return reaction;
    });

  let oreCount = make("FUEL", 1);
  console.log(oreCount);
});

function make(outName, amt) {
  let reactant = reactionsMap[outName];
  let oreCount = 0;

  let ratio = Math.ceil(amt / reactant.amt);

  for (let ingredient of reactant.ingredients) {
    let { name, amt } = ingredient;

    let createdAmt = ratio * amt;

    if (name === "ORE") {
      oreCount += createdAmt;
    } else {
      storage[name] = storage[name] || 0;
      if (storage[name] < createdAmt) {
        let amtLeft = createdAmt - storage[name];
        oreCount += make(name, amtLeft);
      }

      storage[name] -= createdAmt;
    }
  }

  storage[outName] = storage[outName] || 0;
  storage[outName] += ratio * reactant.amt;

  return oreCount;
}
