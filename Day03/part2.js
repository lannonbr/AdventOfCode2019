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

  let lineAVectors = createVectors(wires[0]);
  let lineBVectors = createVectors(wires[1]);

  let intersections = [];

  // check for intersections between the lines of A and B
  for (let i = 0; i < lineAVectors.length; i++) {
    for (let j = 0; j < lineBVectors.length; j++) {
      let aVec = lineAVectors[i];
      let bVec = lineBVectors[j];

      let aVecVert = aVec[0][0] === aVec[1][0];
      let bVecVert = bVec[0][0] === bVec[1][0];

      let possibleIntersection = [];

      if (aVecVert && !bVecVert) {
        possibleIntersection = checkForIntersection(bVec, aVec);
      } else if (!aVecVert && bVecVert) {
        possibleIntersection = checkForIntersection(aVec, bVec);
      } else {
        // Skip if the lines are parallel
        continue;
      }

      // if the result of checkForIntersection is a vector of len 2, then it is an intersection and add it to the array of intersections
      if (possibleIntersection.length === 2) {
        intersections.push({
          int: possibleIntersection,
          i,
          j,
          aVecVert,
          bVecVert
        });
      }
    }
  }

  intersections = intersections.map(int => {
    let aLen = 0;
    let bLen = 0;

    let aVec = lineAVectors[int.i];
    let bVec = lineBVectors[int.j];

    for (let a = 0; a < int.i; a++) {
      aLen += lineAVectors[a][2];
    }

    // Grab the dist between the last A vector start point and the intersection point
    if (int.aVecVert) {
      aLen += Math.abs(aVec[0][1] - int.int[1]);
    } else {
      aLen += Math.abs(aVec[0][0] - int.int[0]);
    }

    for (let b = 0; b < int.j; b++) {
      bLen += lineBVectors[b][2];
    }

    // Grab the dist between the last B vector start point and the intersection point
    if (int.bVecVert) {
      bLen += Math.abs(bVec[0][1] - int.int[1]);
    } else {
      bLen += Math.abs(bVec[0][0] - int.int[0]);
    }

    return { ...int, dist: aLen + bLen };
  });

  const shortestSignalDelayDist = intersections.sort(
    (a, b) => a.dist - b.dist
  )[0].dist;

  console.log(shortestSignalDelayDist);
});

function createVectors(wires) {
  let currentPos = [0, 0];
  let vectors = [];

  wires.forEach(movement => {
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

    // each vector will include the start point, end point, and distance
    vectors.push([start, end, movement[1]]);
  });

  return vectors;
}

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
