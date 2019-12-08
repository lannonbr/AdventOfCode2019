const fs = require("fs");
const path = require("path");

fs.promises.readFile(path.join(__dirname, "input.txt")).then(buf => {
  let pixels = buf.toString().split("");
  let w = 25;
  let h = 6;
  let layers = clump(pixels, w, h);

  let image = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      lay: for (let l = 0; l < layers.length; l++) {
        let pixel = layers[l][y * 25 + x];
        if (pixel !== "2") {
          if (pixel === "1") {
            image.push("█");
          } else {
            image.push(" ");
          }
          break lay;
        }
      }
    }
  }

  // console.log(image);
  for (let y = 0; y < h; y++) {
    console.log(image.slice(y * w, (y + 1) * w).join(""));
  }
});

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
