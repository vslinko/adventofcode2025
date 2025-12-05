import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 5,

  // input: ``,

  testInput1: `3-5
  10-14
  16-20
  12-18

  1
  5
  8
  11
  17
  32`,
  expectedTestAnswer1: 3,

  // testInput2: ``,
  expectedTestAnswer2: 14,
};

function part1(input) {
  const [rangesLines, idsLines] = input.trim().split("\n\n");
  const ranges = rangesLines
    .split("\n")
    .map((l) => l.trim().split("-").map(Number));
  const ids = idsLines.split("\n").map((l) => Number(l));

  let solution = 0;

  x: for (const id of ids) {
    for (const [a, b] of ranges) {
      if (id >= a && id <= b) {
        solution++;
        continue x;
      }
    }
  }

  return solution;
}

function cleanRangesStep(ranges) {
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (ranges[i][0] <= ranges[j][0] && ranges[i][1] >= ranges[j][1]) {
        ranges.splice(j, 1);
        j--;
        continue;
      }

      if (ranges[i][0] <= ranges[j][1] && ranges[i][1] >= ranges[j][1]) {
        ranges[j][1] = ranges[i][0] - 1;
      }

      if (ranges[i][1] >= ranges[j][0] && ranges[i][0] <= ranges[j][0]) {
        ranges[j][0] = ranges[i][1] + 1;
      }
    }
  }
}

function part2(input) {
  const [rangesLines] = input.trim().split("\n\n");
  const ranges = rangesLines
    .split("\n")
    .map((l) => l.trim().split("-").map(Number));

  cleanRangesStep(ranges);
  ranges.reverse();
  cleanRangesStep(ranges);

  let solution = 0;
  for (const [a, b] of ranges) {
    solution += b - a + 1;
  }

  return solution;
}

await run(config, part1, part2);
