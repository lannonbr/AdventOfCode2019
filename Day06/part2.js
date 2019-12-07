const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(async buf => {
  let connections = buf
    .toString()
    .split("\n")
    .map(connection => {
      const [val, child] = connection.split(")");

      return {
        val,
        child
      };
    });

  let graph = generateGraph(connections, "COM");

  // the code for getPath is buggy, but at the front it will contain the path between COM and YOU / SAN, so chop off anything after it
  let youPath = await getPath(graph, "YOU");
  youPath = youPath.slice(0, youPath.findIndex(f => f === "YOU") + 1);

  let santaPath = await getPath(graph, "SAN");
  santaPath = santaPath.slice(0, santaPath.findIndex(f => f === "SAN") + 1);

  // Chop off the front where they both match
  while (youPath[0] === santaPath[0]) {
    youPath.shift();
    santaPath.shift();
  }

  // get rid of SAN & YOU
  youPath.pop();
  santaPath.pop();

  // The hops between the two is the sum of the two paths
  console.log({ result: youPath.length + santaPath.length });
});

function generateGraph(connections, valSearch) {
  const currentNode = {
    val: valSearch,
    children: connections
      .filter(conn => conn.val === valSearch)
      .map(node => node.child)
  };
  currentNode.children = currentNode.children.map(node =>
    generateGraph(connections, node)
  );
  return currentNode;
}

// Don't ponder too much on getPath and getPathAux, What I wanted it to do is a
// depth first search for the number and then pass the path back up. It kinda
// does that but I have to chop some entries off after it is done finding the path.
function getPath(node, key) {
  let path = [node.val];

  let found = false;

  return new Promise((resolve, reject) => {
    if (node.val === key) {
      return path;
    } else {
      if (node.children) {
        node.children.forEach(cnode => {
          let auxPath = getPathAux(path, cnode, key, found);
          if (auxPath.length > 0) {
            resolve(auxPath[0]);
          }
        });
      } else {
        reject();
      }
    }
  });
}

function getPathAux(path, node, key, found) {
  path.push(node.val);

  if (node.val === key) {
    found = true;
    return [path, found];
  } else {
    if (node.children) {
      node.children.forEach(cnode => {
        [path, found] = getPathAux(path, cnode, key, found);
        if (path.length > 0) {
          return path;
        }
      });
    } else {
      path.pop();
      return [path, found];
    }
    if (found) {
      return [path, found];
    }
    path.pop();
    return [path, found];
  }
}
