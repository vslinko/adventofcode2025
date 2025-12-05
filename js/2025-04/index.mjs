import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 4,

  // input: ``,

  testInput1: `..@@.@@@@.
  @@@.@.@.@@
  @@@@@.@.@@
  @.@@@@..@.
  @@.@@@@.@@
  .@@@@@@@.@
  .@.@.@.@@@
  @.@@@.@@@@
  .@@@@@@@@.
  @.@.@@@.@.
`,
  expectedTestAnswer1: 13,

  // testInput2: ``,
  expectedTestAnswer2: 43,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  function check(x, y) {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= lines[0].length) return;
    if (y >= lines.length) return;
    return lines[y][x] === "@";
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (check(x, y)) {
        let near = 0;
        if (check(x - 1, y - 1)) near++;
        if (check(x, y - 1)) near++;
        if (check(x + 1, y - 1)) near++;
        if (check(x - 1, y)) near++;
        if (check(x + 1, y)) near++;
        if (check(x - 1, y + 1)) near++;
        if (check(x, y + 1)) near++;
        if (check(x + 1, y + 1)) near++;
        if (near < 4) solution++;
      }
    }
  }

  return solution;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(""));

  assert(lines.length > 0);

  let solution = 0;

  function check(x, y) {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= lines[0].length) return;
    if (y >= lines.length) return;
    return lines[y][x] === "@";
  }

  let removed = false;
  do {
    removed = false;
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[0].length; x++) {
        if (check(x, y)) {
          let near = 0;
          if (check(x - 1, y - 1)) near++;
          if (check(x, y - 1)) near++;
          if (check(x + 1, y - 1)) near++;
          if (check(x - 1, y)) near++;
          if (check(x + 1, y)) near++;
          if (check(x - 1, y + 1)) near++;
          if (check(x, y + 1)) near++;
          if (check(x + 1, y + 1)) near++;
          if (near < 4) {
            lines[y][x] = ".";
            solution++;
            removed = true;
          }
        }
      }
    }
  } while (removed);

  return solution;
}

await run(config, part1, part2);
