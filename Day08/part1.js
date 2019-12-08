const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let pixels = buf.toString().split("");
  let layers = clump(pixels, 25, 6);

  layers = layers.map(l => ({
    count: count(l, "0"),
    layer: l
  }));

  layers.sort((a, b) => {
    return a.count - b.count;
  });

  let bestLayer = layers[0];

  let c1s = count(bestLayer.layer, "1");
  let c2s = count(bestLayer.layer, "2");

  console.log(c1s * c2s);
});

function count(layer, number) {
  return layer.reduce((a, b) => {
    return a + (b === number);
  }, 0);
}

function clump(pixels, width, height) {
  let layers = [];
  let l = 0;
  while (l < pixels.length) {
    let newLayer = pixels.slice(l, l + width * height);
    layers.push(newLayer);
    l += width * height;
  }
  return layers;
}
