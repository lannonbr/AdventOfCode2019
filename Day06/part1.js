const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
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

  let counts = {};

  // generate a map where a key is a node and the value is the number of hops from COM
  counts = addCounts(counts, graph, 0);

  // The sum of those is the number of direct & indirect orbits
  let sum = Object.entries(counts).reduce((acc, curr) => acc + curr[1], 0);
  console.log({ sum });
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

function addCounts(counts, currnode, i) {
  counts[currnode.val] = i;
  if (currnode.children) {
    currnode.children.forEach(node => {
      counts = addCounts(counts, node, i + 1);
    });
  }
  return counts;
}
