import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 2,

  // input: ``,

  testInput1: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
  1698522-1698528,446443-446449,38593856-38593862,565653-565659,
  824824821-824824827,2121212118-2121212124`,
  expectedTestAnswer1: 1227775554,

  // testInput2: ``,
  expectedTestAnswer2: 4174379265,
};

function part1(input) {
  const pairs = input
    .trim()
    .split(",")
    .map((x) => x.split("-").map(Number));

  let solution = 0;

  for (const [a, b] of pairs) {
    for (let id = a; id <= b; id++) {
      if (isInvalidID2(id)) {
        solution += id;
      }
    }
  }

  return solution;
}

function isInvalidID2(id) {
  const ii = String(id);
  if (ii.length % 2 != 0) {
    return false;
  }
  const l = ii.length / 2;
  const left = ii.slice(0, l);
  const right = ii.slice(l);
  return left === right;
}

function part2(input) {
  const pairs = input
    .trim()
    .split(",")
    .map((x) => x.split("-").map(Number));

  let solution = 0;

  for (const [a, b] of pairs) {
    for (let id = a; id <= b; id++) {
      if (isInvalidID(id)) {
        solution += id;
      }
    }
  }

  return solution;
}

function isInvalidID(id) {
  const ii = String(id);

  x: for (let d = 2; d <= ii.length; d++) {
    if (ii.length % d != 0) continue;

    const l = ii.length / d;
    const left = ii.slice(0, l);

    for (let x = l; x <= ii.length - l; x += l) {
      const right = ii.slice(x, x + l);
      if (left !== right) {
        continue x;
      }
    }

    return true;
  }

  return false;
}

await run(config, part1, part2);
