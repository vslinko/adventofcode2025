import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 7,

  // input: ``,

  testInput1: `.......S.......
  ...............
  .......^.......
  ...............
  ......^.^......
  ...............
  .....^.^.^.....
  ...............
  ....^.^...^....
  ...............
  ...^.^...^.^...
  ...............
  ..^...^.....^..
  ...............
  .^.^.^.^.^...^.
  ...............
`,
  expectedTestAnswer1: 21,

  // testInput2: ``,
  expectedTestAnswer2: 40,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(""));

  assert(lines.length > 0);

  let solution = 0;

  for (let x = 0; x < lines[0].length; x++) {
    if (lines[0][x] === "S") {
      lines[1][x] = "|";
    }
  }
  for (let y = 1; y < lines.length - 1; y++) {
    const line = lines[y];
    const nextLine = lines[y + 1];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "|") {
        if (nextLine[x] === ".") {
          nextLine[x] = "|";
        } else if (nextLine[x] === "^") {
          solution++;
          if (x > 0) {
            assert(nextLine[x - 1] === "." || nextLine[x - 1] === "|");
            nextLine[x - 1] = "|";
          }
          if (x < line.length - 1) {
            assert(nextLine[x + 1] === "." || nextLine[x + 1] === "|");
            nextLine[x + 1] = "|";
          }
        }
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

  const graph = new Map();
  let source;
  function getId(x, y) {
    return x + y * lines[0].length;
  }
  function addEdge(u, v) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u).push(v);
  }

  for (let x = 0; x < lines[0].length; x++) {
    if (lines[0][x] === "S") {
      source = getId(x, 0);
      lines[1][x] = "|";
      addEdge(source, getId(x, 1));
    }
  }
  for (let y = 1; y < lines.length - 1; y++) {
    const line = lines[y];
    const nextLine = lines[y + 1];
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "|") {
        if (nextLine[x] === ".") {
          addEdge(getId(x, y), getId(x, y + 1));
          nextLine[x] = "|";
        } else if (nextLine[x] === "^") {
          if (x > 0) {
            assert(nextLine[x - 1] === "." || nextLine[x - 1] === "|");
            nextLine[x - 1] = "|";
            addEdge(getId(x, y), getId(x - 1, y + 1));
          }
          if (x < line.length - 1) {
            assert(nextLine[x + 1] === "." || nextLine[x + 1] === "|");
            nextLine[x + 1] = "|";
            addEdge(getId(x, y), getId(x + 1, y + 1));
          }
        } else {
          assert(nextLine[x] === "|");
          addEdge(getId(x, y), getId(x, y + 1));
        }
      }
    }
  }

  const cache = new Map();

  function r(n) {
    if (cache.has(n)) return cache.get(n);

    const childs = graph.get(n) || [];

    if (childs.length === 0) {
      cache.set(n, 1);
      return 1;
    }

    let result = 0;
    for (const child of childs) {
      result += r(child);
    }

    cache.set(n, result);

    return result;
  }

  return r(source);
}

await run(config, part1, part2);
