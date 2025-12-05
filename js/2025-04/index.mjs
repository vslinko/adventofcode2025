import assert from "node:assert";
import fs from "node:fs/promises";

const config = {
  year: 2025,
  day: 4,

  // input: ``,

  testInput1: `..@@.@@@@.
  @@@.@.@.@@
  @@@@@.@.@@
  @.@@@@..@.
  @@.@@@@.@@
  .@@@@@@@.@
  .@.@.@.@@@
  @.@@@.@@@@
  .@@@@@@@@.
  @.@.@@@.@.
`,
  expectedTestAnswer1: 13,

  // testInput2: ``,
  expectedTestAnswer2: 43,
};

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim());

  assert(lines.length > 0);

  let solution = 0;

  function check(x, y) {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= lines[0].length) return;
    if (y >= lines.length) return;
    return lines[y][x] === "@";
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (check(x, y)) {
        let near = 0;
        if (check(x - 1, y - 1)) near++;
        if (check(x, y - 1)) near++;
        if (check(x + 1, y - 1)) near++;
        if (check(x - 1, y)) near++;
        if (check(x + 1, y)) near++;
        if (check(x - 1, y + 1)) near++;
        if (check(x, y + 1)) near++;
        if (check(x + 1, y + 1)) near++;
        if (near < 4) solution++;
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

  let solution = 0;

  function check(x, y) {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= lines[0].length) return;
    if (y >= lines.length) return;
    return lines[y][x] === "@";
  }

  let removed = false;
  do {
    removed = false;
    for (let y = 0; y < lines.length; y++) {
      for (let x = 0; x < lines[0].length; x++) {
        if (check(x, y)) {
          let near = 0;
          if (check(x - 1, y - 1)) near++;
          if (check(x, y - 1)) near++;
          if (check(x + 1, y - 1)) near++;
          if (check(x - 1, y)) near++;
          if (check(x + 1, y)) near++;
          if (check(x - 1, y + 1)) near++;
          if (check(x, y + 1)) near++;
          if (check(x + 1, y + 1)) near++;
          if (near < 4) {
            lines[y][x] = ".";
            solution++;
            removed = true;
          }
        }
      }
    }
  } while (removed);

  return solution;
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
        await fs.readFile("../../aoc_session.txt", "utf-8")
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
