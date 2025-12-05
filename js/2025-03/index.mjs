import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 3,

  // input: ``,

  testInput1: `987654321111111
  811111111111119
  234234234234278
  818181911112111
`,
  expectedTestAnswer1: 357,

  // testInput2: ``,
  expectedTestAnswer2: 3121910778619,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  for (const line of lines) {
    let max = 0;
    for (let l = 0; l < line.length - 1; l++) {
      for (let r = l + 1; r < line.length; r++) {
        const n = Number(line[l] + line[r]);
        max = Math.max(max, n);
      }
    }
    solution += max;
  }

  return solution;
}

function findMaxNumber(arr) {
  let maxValue = arr[0];
  let maxIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    const n = arr[i];
    if (n === 9) {
      return i;
    }
    if (n > maxValue) {
      maxValue = n;
      maxIndex = i;
    }
  }
  return maxIndex;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  for (const line of lines) {
    const nums = new Uint8Array(line.split("").map(Number));
    let max = 0;
    let leftIndex = 0;
    for (let i = 11; i >= 0; i--) {
      const nextNumberIndex =
        findMaxNumber(nums.subarray(leftIndex, nums.length - i)) + leftIndex;
      max = max * 10 + nums[nextNumberIndex];
      leftIndex = nextNumberIndex + 1;
    }
    solution += max;
  }

  return solution;
}

await run(config, part1, part2);
