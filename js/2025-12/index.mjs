import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 12,

  // input: ``,

  testInput1: `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
`,
  expectedTestAnswer1: 2,

  // testInput2: ``,
  expectedTestAnswer2: null,
};

class Shape {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.data = new Uint8Array(w * h);
  }

  static fromMatrix(arr) {
    const shape = new Shape(arr[0].length, arr.length);
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        shape.data[y * shape.width + x] = arr[y][x];
      }
    }
    return shape;
  }

  weight() {
    return this.data.reduce((a, b) => a + b);
  }

  canPutShape(shape, x, y) {
    for (let y2 = 0; y2 < shape.height; y2++) {
      for (let x2 = 0; x2 < shape.width; x2++) {
        if (
          shape.data[y2 * shape.width + x2] &&
          this.data[(y + y2) * this.width + (x + x2)]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  putShape(shape, x, y) {
    for (let y2 = 0; y2 < shape.height; y2++) {
      for (let x2 = 0; x2 < shape.width; x2++) {
        if (shape.data[y2 * shape.width + x2]) {
          this.data[(y + y2) * this.width + (x + x2)]++;
        }
      }
    }
  }

  removeShape(shape, x, y) {
    for (let y2 = 0; y2 < shape.height; y2++) {
      for (let x2 = 0; x2 < shape.width; x2++) {
        if (shape.data[y2 * shape.width + x2]) {
          this.data[(y + y2) * this.width + (x + x2)]--;
        }
      }
    }
  }

  print() {
    console.log(this.toString());
  }

  rotate() {
    const w = this.width;
    const h = this.height;
    const rotated = new Shape(this.height, this.width);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        rotated.data[x * rotated.width + (h - y - 1)] =
          this.data[y * this.width + x];
      }
    }
    return rotated;
  }

  toString() {
    let str = "";
    for (let y = 0; y < this.height; y++) {
      if (y > 0) {
        str += "\n";
      }
      for (let x = 0; x < this.width; x++) {
        str += this.data[y * this.width + x];
      }
    }
    return str;
  }
}

function part1(input) {
  const lines = input
    .trim()
    .split("\n\n")
    .map((line) => line.trim());

  const shapes = lines
    .slice(0, -1)
    .map((line) =>
      line
        .split("\n")
        .slice(1)
        .map((row) => row.split("").map((c) => (c === "#" ? 1 : 0))),
    )
    .map((matrix) => {
      const m = new Map();
      let shape = Shape.fromMatrix(matrix);
      for (let i = 0; i < 4; i++) {
        m.set(shape.toString(), shape);
        shape = shape.rotate();
      }
      return Array.from(m.values());
    });

  const regions = lines[lines.length - 1].split("\n").map((l) => {
    const [size, shapeCounts] = l.split(": ");
    return [
      size.split("x").map(Number),
      shapeCounts
        .split(" ")
        .map(Number)
        .reduce((acc, count, i) => {
          for (let j = 0; j < count; j++) {
            acc.push(shapes[i]);
          }
          return acc;
        }, []),
    ];
  });

  function r(field, shapesVariants) {
    if (shapesVariants.length === 0) {
      return true;
    }

    const shapeVariants = shapesVariants[0];
    const otherShapesVariants = shapesVariants.slice(1);

    for (const shape of shapeVariants) {
      for (let y = 0; y < field.height - shape.height + 1; y++) {
        for (let x = 0; x < field.width - shape.width + 1; x++) {
          if (!field.canPutShape(shape, x, y)) {
            continue;
          }

          field.putShape(shape, x, y);

          if (r(field, otherShapesVariants)) {
            return true;
          }

          field.removeShape(shape, x, y);
        }
      }
    }

    return false;
  }

  let solution = 0;

  for (const [[w, h], allShapeVariants] of regions) {
    const availablePoints = w * h;
    const neededPoints = allShapeVariants
      .map((s) => s[0].weight())
      .reduce((a, b) => a + b);

    if (neededPoints > availablePoints) {
      continue;
    }

    const field = new Shape(w, h);

    if (r(field, allShapeVariants)) {
      solution++;
    }
  }

  return solution;
}

function part2() {
  return 0;
}

await run(config, part1, part2);
