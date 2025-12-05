import assert from "node:assert";
import fs from "node:fs/promises";

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

await (async () => {
  const redBold = (s) => `\x1b[1;31m${s}\x1b[0m`;
  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const yellowBold = (s) => `\x1b[1;33m${s}\x1b[0m`;
  const grayItalic = (s) => `\x1b[3;90m${s}\x1b[0m`;

  console.log();

  let {
    year,
    day,
    input,
    testInput1,
    expectedTestAnswer1,
    testInput2,
    expectedTestAnswer2,
  } = config;

  if (!testInput2) {
    testInput2 = testInput1;
  }

  const inputFile = `./input.txt`;
  input = input ? input.trim() : "";

  if (input.length === 0) {
    try {
      const data = await fs.readFile(inputFile, "utf8");
      input = data.trim();
      if (input.length > 0) {
        console.log(green("Input read from file"));
        console.log();
      }
    } catch (e) {}
  }

  if (!process.env.ADVENT_OF_CODE_SESSION) {
    try {
      process.env.ADVENT_OF_CODE_SESSION = (
        await fs.readFile(
          "/Users/vdslinko/qwe/diofant/aoc_session.txt",
          "utf-8",
        )
      ).trim();
    } catch {}
  }

  if (input.length === 0 && process.env.ADVENT_OF_CODE_SESSION) {
    try {
      const res = await fetch(
        `https://adventofcode.com/${year}/day/${day}/input`,
        {
          headers: {
            cookie: `session=${process.env.ADVENT_OF_CODE_SESSION}`,
          },
          method: "GET",
        },
      );

      assert.equal(res.status, 200);

      const data = await res.text();
      await fs.writeFile(inputFile, data);
      input = data.trim();
      console.log(green("Input downloaded and saved to file"));
      console.log();
    } catch (e) {
      console.log(redBold("Unable to download input file"));
      console.log();
    }
  }

  for (const [n, fn, testInput, expectedTestAnswer] of [
    [1, part1, testInput1, expectedTestAnswer1],
    [2, part2, testInput2, expectedTestAnswer2],
  ]) {
    console.log(`\x1b[1;36mPart #${n}\x1b[0m`);

    const trimmedTestIntput = testInput.trim();

    if (trimmedTestIntput.length === 0 || expectedTestAnswer == null) {
      console.log(grayItalic(`No test input or answer provided`));
      console.log();
      continue;
    }

    performance.mark("test fn start");
    const testAnswer = fn(trimmedTestIntput);
    const testDuration = performance
      .measure("test fn duration", "test fn start")
      .duration.toFixed(2);
    const isTestAnswerCorrect = testAnswer === expectedTestAnswer;

    console.log(
      (isTestAnswerCorrect ? grayItalic : redBold)(
        `${testAnswer} ${
          isTestAnswerCorrect ? "==" : "!="
        } ${expectedTestAnswer}`,
      ) + ` ${grayItalic(testDuration + "ms")}`,
    );

    if (isTestAnswerCorrect) {
      if (input.length === 0) {
        console.log(redBold(`No input provided`));
        console.log();
        continue;
      }

      performance.mark("fn start");
      const realAnswer = fn(input);
      const duration = performance
        .measure("fn duration", "fn start")
        .duration.toFixed(2);

      console.log(
        `${green("solution" + n)}: ${yellowBold(realAnswer)} ${grayItalic(duration + "ms")}`,
      );
    }

    console.log();
  }
})();
