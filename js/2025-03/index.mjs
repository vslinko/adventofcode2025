import assert from "node:assert";
import fs from "node:fs/promises";

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
