import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 8,

  // input: ``,

  testInput1: `162,817,812
  57,618,57
  906,360,560
  592,479,940
  352,342,300
  466,668,158
  542,29,236
  431,825,988
  739,650,466
  52,470,668
  216,146,977
  819,987,18
  117,168,530
  805,96,715
  346,949,466
  970,615,88
  941,993,340
  862,61,35
  984,92,344
  425,690,689
`,
  expectedTestAnswer1: 40,

  // testInput2: ``,
  expectedTestAnswer2: 25272,
};

function euclidean(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
      Math.pow(a[1] - b[1], 2) +
      Math.pow(a[2] - b[2], 2),
  );
}

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(",").map(Number));

  assert(lines.length > 0);

  const dists = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      dists.push([lines[i], lines[j], euclidean(lines[i], lines[j])]);
    }
  }
  dists.sort((a, b) => a[2] - b[2]);

  const circuits = new Map();
  const allCircuits = new Set();
  const limit = lines.length === 20 ? 10 : 1000;

  let done = 0;
  for (const [a, b] of dists) {
    if (circuits.has(a) && circuits.has(b)) {
      const aCircuit = circuits.get(a);
      const bCircuit = circuits.get(b);

      if (aCircuit !== bCircuit) {
        const mergedCircuit = new Set([...aCircuit, ...bCircuit]);
        for (const box of mergedCircuit) {
          circuits.set(box, mergedCircuit);
        }

        allCircuits.delete(aCircuit);
        allCircuits.delete(bCircuit);
        allCircuits.add(mergedCircuit);
      }
    } else if (circuits.has(a)) {
      const c = circuits.get(a);
      c.add(b);
      circuits.set(b, c);
    } else if (circuits.has(b)) {
      const c = circuits.get(b);
      c.add(a);
      circuits.set(a, c);
    } else {
      const c = new Set();
      c.add(a);
      c.add(b);
      circuits.set(a, c);
      circuits.set(b, c);
      allCircuits.add(c);
    }

    if (++done === limit) {
      break;
    }
  }

  return Array.from(allCircuits)
    .map((c) => c.size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b);
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(",").map(Number));

  assert(lines.length > 0);

  const dists = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      dists.push([lines[i], lines[j], euclidean(lines[i], lines[j])]);
    }
  }
  dists.sort((a, b) => a[2] - b[2]);

  const circuits = new Map();

  for (const [a, b] of dists) {
    if (circuits.has(a) && circuits.has(b)) {
      const aCircuit = circuits.get(a);
      const bCircuit = circuits.get(b);

      if (aCircuit !== bCircuit) {
        const mergedCircuit = new Set([...aCircuit, ...bCircuit]);
        for (const box of mergedCircuit) {
          circuits.set(box, mergedCircuit);
        }
      }
    } else if (circuits.has(a)) {
      const c = circuits.get(a);
      c.add(b);
      circuits.set(b, c);
    } else if (circuits.has(b)) {
      const c = circuits.get(b);
      c.add(a);
      circuits.set(a, c);
    } else {
      const c = new Set();
      c.add(a);
      c.add(b);
      circuits.set(a, c);
      circuits.set(b, c);
    }

    if (circuits.size === lines.length) {
      return a[0] * b[0];
    }
  }
}

await run(config, part1, part2);
