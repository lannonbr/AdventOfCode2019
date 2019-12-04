const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let wires = buf
    .toString()
    .split("\n")
    .map(wire => {
      return wire.split(",").map(movement => {
        return [movement[0], +movement.slice(1)];
      });
    });

  let lineAVectors = [];
  let lineBVectors = [];

  let currentPos = [0, 0];

  wires[0].forEach(movement => {
    let start = [...currentPos];

    if (movement[0] === "L") {
      currentPos[0] -= movement[1];
    } else if (movement[0] === "R") {
      currentPos[0] += movement[1];
    } else if (movement[0] === "U") {
      currentPos[1] -= movement[1];
    } else if (movement[0] === "D") {
      currentPos[1] += movement[1];
    }

    let end = [...currentPos];
    lineAVectors.push([start, end]);
  });

  currentPos = [0, 0];

  wires[1].forEach(movement => {
    let start = [...currentPos];

    if (movement[0] === "L") {
      currentPos[0] -= movement[1];
    } else if (movement[0] === "R") {
      currentPos[0] += movement[1];
    } else if (movement[0] === "U") {
      currentPos[1] -= movement[1];
    } else if (movement[0] === "D") {
      currentPos[1] += movement[1];
    }

    let end = [...currentPos];
    lineBVectors.push([start, end]);
  });

  // Horizontal lines of A have the same Y value
  let horizLineAs = lineAVectors.filter(vector => {
    return vector[0][1] === vector[1][1];
  });

  // Vertical lines of A have the same X value
  let vertLineAs = lineAVectors.filter(vector => {
    return vector[0][0] === vector[1][0];
  });

  // Horizontal lines of B have the same Y value
  let horizLineBs = lineBVectors.filter(vector => {
    return vector[0][1] === vector[1][1];
  });

  // Vertical lines of B have the same X value
  let vertLineBs = lineBVectors.filter(vector => {
    return vector[0][0] === vector[1][0];
  });

  let intersections = [];

  // check for intersections between the horizontal lines of A and vertical lines of B
  for (let i = 0; i < horizLineAs.length; i++) {
    for (let j = 0; j < vertLineBs.length; j++) {
      let possibleIntersection = checkForIntersection(
        horizLineAs[i],
        vertLineBs[j]
      );

      // if the result of checkForIntersection is a vector of len 2, then it is an intersection and add it to the array of intersections
      if (possibleIntersection.length === 2) {
        intersections.push(possibleIntersection);
      }
    }
  }

  // check for intersections between the vertical lines of A and horizontal lines of B
  for (let i = 0; i < horizLineBs.length; i++) {
    for (let j = 0; j < vertLineAs.length; j++) {
      let possibleIntersection = checkForIntersection(
        horizLineBs[i],
        vertLineAs[j]
      );

      // if the result of checkForIntersection is a vector of len 2, then it is an intersection and add it to the array of intersections
      if (possibleIntersection.length === 2) {
        intersections.push(possibleIntersection);
      }
    }
  }

  console.log(intersections);

  // The manhattan distance of a 2d vector between any point (x,y) and (0,0) is just the sum x+y
  let closestIntersection = intersections.map(manhattanDist2d).sort()[0];
  console.log(closestIntersection);
});

const manhattanDist2d = vec => vec[0] + vec[1];

function checkForIntersection(horizVector, vertVector) {
  let [[x1, y1], [x2, y2]] = horizVector;
  let [[x3, y3], [x4, y4]] = vertVector;

  let xIntersect = false;
  let yIntersect = false;

  if (x1 < x2) {
    if (x1 <= x3 && x3 <= x2) {
      xIntersect = true;
    }
  } else {
    if (x2 <= x3 && x3 <= x1) {
      xIntersect = true;
    }
  }

  if (y3 < y4) {
    if (y3 <= y1 && y1 <= y4) {
      yIntersect = true;
    }
  } else {
    if (y4 <= y1 && y1 <= y3) {
      yIntersect = true;
    }
  }

  if (xIntersect && yIntersect) {
    return [x3, y1];
  } else {
    return [];
  }
}
