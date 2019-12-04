const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let [start, end] = buf
    .toString()
    .split("-")
    .map(Number);

  console.log([start, end]);

  const validPasswords = [];

  for (let i = start; i <= end; i++) {
    let num = i.toString();

    const { isDecreasing, index } = decrease(num);

    // if it is decreasing, the next number that would be valid to continue with would be
    // the point it decreases filled in with said number
    // ex: 143262 decreases after 4, so it would be 144444
    if (isDecreasing) {
      i = fillWithNum(num, index) - 1;
      continue;
    }

    if (!double(num)) {
      continue;
    }

    validPasswords.push(num);
  }

  console.log(JSON.stringify(validPasswords));
  console.log(validPasswords.length);
});

function decrease(number) {
  for (let i = 0; i < number.length - 1; i++) {
    if (+number[i] > +number[i + 1]) {
      return { isDecreasing: true, index: i };
    }
  }

  return { isDecreasing: false };
}

function fillWithNum(num, index) {
  let newNum = [...num];

  for (let i = index + 1; i < num.length; i++) {
    newNum[i] = +num[index];
  }

  const result = +newNum.join("");

  console.log(`skipping from ${num} to ${result}`);

  return result;
}

function double(number) {
  for (let i = 0; i < number.length - 1; i++) {
    if (+number[i] === +number[i + 1]) {
      return true;
    }
  }

  return false;
}
