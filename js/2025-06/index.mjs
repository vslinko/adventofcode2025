import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 6,

  // input: ``,

  testInput1: `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +
`,
  expectedTestAnswer1: 4277556,

  // testInput2: ``,
  expectedTestAnswer2: 3263827,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/));

  assert(lines.length > 0);

  let solution = 0;

  const groups = new Array(lines[0].length).fill(null).map(() => []);

  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      const n = line[i];

      if (n === "*") {
        solution += groups[i].reduce((acc, val) => acc * val);
      } else if (n === "+") {
        solution += groups[i].reduce((acc, val) => acc + val);
      } else {
        groups[i].push(Number(n));
      }
    }
  }

  return solution;
}

function part2(input) {
  const lines = input.trim().split("\n");
  const maxLen = Math.max(...lines.map((line) => line.length));

  assert(lines.length > 0);

  let solution = 0;
  let mathOperation = null;
  let mathResult = null;

  for (let i = 0; i < maxLen + 1; i++) {
    let n = 0;

    for (const line of lines) {
      if (!line[i]) continue;

      if (line[i].charCodeAt(0) >= 48 && line[i].charCodeAt(0) <= 57) {
        n *= 10;
        n += Number(line[i]);
      } else if (line[i] === "*") {
        mathOperation = "*";
        mathResult = 1;
      } else if (line[i] === "+") {
        mathOperation = "+";
        mathResult = 0;
      }
    }

    if (n > 0) {
      if (mathOperation === "*") {
        mathResult *= n;
      } else if (mathOperation === "+") {
        mathResult += n;
      }
    } else {
      solution += mathResult;
    }
  }

  return solution;
}

await run(config, part1, part2);
