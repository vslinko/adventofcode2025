import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 1,

  // input: ``,

  testInput1: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
  expectedTestAnswer1: 3,

  testInput2: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
  expectedTestAnswer2: 6,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  const turns = lines.map((line) => {
    const direction = line[0];
    const steps = line.slice(1);
    return { direction, steps: Number(steps) };
  });

  let pos = 50;

  for (const turn of turns) {
    if (turn.direction === "L") {
      pos -= turn.steps;
    } else {
      pos += turn.steps;
    }
    while (pos < 0) {
      pos += 100;
    }
    while (pos >= 100) {
      pos -= 100;
    }
    if (pos === 0) {
      solution++;
    }
  }

  return solution;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  const turns = lines.map((line) => {
    const direction = line[0];
    const steps = line.slice(1);
    return { direction, steps: Number(steps) };
  });

  let pos = 50;

  for (const turn of turns) {
    while (turn.steps > 0) {
      if (turn.direction === "L") {
        pos -= 1;
      } else {
        pos += 1;
      }
      turn.steps--;
      if (pos < 0) {
        pos = 99;
      }
      if (pos > 99) {
        pos = 0;
      }
      if (pos === 0) {
        solution++;
      }
    }
  }

  return solution;
}

await run(config, part1, part2);
