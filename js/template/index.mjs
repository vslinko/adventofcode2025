import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 25,

  // input: ``,

  testInput1: ``,
  expectedTestAnswer1: null,

  // testInput2: ``,
  expectedTestAnswer2: null,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  return solution;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  return solution;
}

await run(config, part1, part2);
