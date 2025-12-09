import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 9,

  // input: ``,

  testInput1: `7,1
  11,1
  11,7
  9,7
  9,5
  2,5
  2,3
  7,3
`,
  expectedTestAnswer1: 50,

  // testInput2: ``,
  expectedTestAnswer2: 24,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(",").map(Number));

  assert(lines.length > 0);

  let solution = 0;

  for (const [x1, y1] of lines) {
    for (const [x2, y2] of lines) {
      const square = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
      solution = Math.max(solution, square);
    }
  }

  return solution;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(",").map(Number));

  let solution = 0;

  function isInPolygon(px, py) {
    let inside = false;
    for (let i = 0; i < lines.length; i++) {
      const [x1, y1] = lines[i];
      const [x2, y2] = lines[(i + 1) % lines.length];

      // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
      const intersect =
        y1 > py !== y2 > py && px < ((x2 - x1) * (py - y1)) / (y2 - y1) + x1;

      if (intersect) inside = !inside;
    }
    return inside;
  }

  function isOnBoundary(px, py) {
    for (let i = 0; i < lines.length; i++) {
      const [x1, y1] = lines[i];
      const [x2, y2] = lines[(i + 1) % lines.length];

      if (
        x1 === x2 &&
        x1 === px &&
        py >= Math.min(y1, y2) &&
        py <= Math.max(y1, y2)
      ) {
        return true;
      }

      if (
        y1 === y2 &&
        y1 === py &&
        px >= Math.min(x1, x2) &&
        px <= Math.max(x1, x2)
      ) {
        return true;
      }
    }

    return false;
  }

  // https://www.youtube.com/watch?v=bvlIYX9cgls
  function segmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    const a = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const b = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    return a > 0 && a < 1 && b > 0 && b < 1;
  }

  function isValid(rx1, ry1, rx2, ry2) {
    if (!isOnBoundary(rx2, ry1) && !isInPolygon(rx2, ry1)) {
      return false;
    }

    if (!isOnBoundary(rx1, ry2) && !isInPolygon(rx1, ry2)) {
      return false;
    }

    for (let i = 0; i < lines.length; i++) {
      const [x1, y1] = lines[i];
      const [x2, y2] = lines[(i + 1) % lines.length];

      if (segmentsIntersect(rx1, ry1, rx2, ry1, x1, y1, x2, y2)) {
        return false;
      }
      if (segmentsIntersect(rx2, ry1, rx2, ry2, x1, y1, x2, y2)) {
        return false;
      }
      if (segmentsIntersect(rx2, ry2, rx1, ry2, x1, y1, x2, y2)) {
        return false;
      }
      if (segmentsIntersect(rx1, ry2, rx1, ry1, x1, y1, x2, y2)) {
        return false;
      }
    }

    return true;
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const [x1, y1] = lines[i];
      const [x2, y2] = lines[j];

      if (isValid(x1, y1, x2, y2)) {
        const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
        solution = Math.max(solution, area);
      }
    }
  }

  return solution;
}

await run(config, part1, part2);
