import assert from "node:assert";
import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 11,

  // input: ``,

  testInput1: `aaa: you hhh
  you: bbb ccc
  bbb: ddd eee
  ccc: ddd eee fff
  ddd: ggg
  eee: out
  fff: out
  ggg: out
  hhh: ccc fff iii
  iii: out
`,
  expectedTestAnswer1: 5,

  testInput2: `svr: aaa bbb
  aaa: fft
  fft: ccc
  bbb: tty
  tty: ccc
  ccc: ddd eee
  ddd: hub
  hub: fff
  eee: dac
  dac: fff
  fff: ggg hhh
  ggg: out
  hhh: out
`,
  expectedTestAnswer2: 2,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  const graph = new Map();

  for (const line of lines) {
    const parts = line.split(" ");
    const from = parts[0].slice(0, -1);
    const outs = parts.slice(1);
    for (const out of outs) {
      if (!graph.has(from)) graph.set(from, []);
      graph.get(from).push(out);
    }
  }

  function r(p) {
    if (p === "out") {
      solution++;
      return;
    }

    const neighbors = graph.get(p) || [];
    for (const next of neighbors) {
      r(next);
    }
  }

  r("you");

  return solution;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  const graph = new Map();

  for (const line of lines) {
    const parts = line.split(" ");
    const from = parts[0].slice(0, -1);
    const outs = parts.slice(1);
    for (const out of outs) {
      if (!graph.has(from)) graph.set(from, []);
      graph.get(from).push(out);
    }
  }

  function r(p, end, skip, memo) {
    if (p === end) {
      return 1;
    }

    if (p === skip) return 0;

    if (memo.has(p)) return memo.get(p);

    let total = 0;

    const neighbors = graph.get(p) || [];
    for (const next of neighbors) {
      total += r(next, end, skip, memo);
    }

    memo.set(p, total);

    return total;
  }

  const s2f = r("svr", "fft", "dac", new Map());
  const s2d = r("svr", "dac", "fft", new Map());
  const f2d = r("fft", "dac", null, new Map());
  const d2f = r("dac", "fft", null, new Map());
  const d2o = r("dac", "out", "fft", new Map());
  const f2o = r("fft", "out", "dac", new Map());

  const s2d2f2o = s2d * d2f * f2o;
  const s2f2d2o = s2f * f2d * d2o;

  return s2d2f2o + s2f2d2o;
}

await run(config, part1, part2);
