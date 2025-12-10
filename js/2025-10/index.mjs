import { run } from "../lib.mjs";

const config = {
  year: 2025,
  day: 10,

  // input: ``,

  testInput1: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
  [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
  [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`,
  expectedTestAnswer1: 7,

  // testInput2: ``,
  expectedTestAnswer2: 33,
};

class BinaryHeap {
  #heap;

  constructor() {
    this.#heap = [];
  }

  // Private Element class
  static #Element = class {
    constructor(element, priority) {
      this.element = element;
      this.priority = priority;
    }
  };

  keepBest(n) {
    this.#heap.sort((a, b) => a.priority - b.priority);
    this.#heap.splice(n);
  }

  // Private helper methods
  #getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  #getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  #getRightChildIndex(index) {
    return 2 * index + 2;
  }

  #swap(index1, index2) {
    const temp = this.#heap[index1];
    this.#heap[index1] = this.#heap[index2];
    this.#heap[index2] = temp;
  }

  #bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.#getParentIndex(index);

      if (this.#heap[parentIndex].priority >= this.#heap[index].priority) {
        break;
      }

      this.#swap(index, parentIndex);
      index = parentIndex;
    }
  }

  #bubbleDown(index) {
    while (true) {
      let maxIndex = index;
      const leftChild = this.#getLeftChildIndex(index);
      const rightChild = this.#getRightChildIndex(index);

      if (
        leftChild < this.#heap.length &&
        this.#heap[leftChild].priority > this.#heap[maxIndex].priority
      ) {
        maxIndex = leftChild;
      }

      if (
        rightChild < this.#heap.length &&
        this.#heap[rightChild].priority > this.#heap[maxIndex].priority
      ) {
        maxIndex = rightChild;
      }

      if (maxIndex === index) {
        break;
      }

      this.#swap(index, maxIndex);
      index = maxIndex;
    }
  }

  // Public methods
  add(element, priority) {
    const node = new BinaryHeap.#Element(element, -priority);
    this.#heap.push(node);
    this.#bubbleUp(this.#heap.length - 1);
  }

  pop() {
    if (this.#heap.length === 0) {
      return null;
    }

    if (this.#heap.length === 1) {
      return this.#heap.pop().element;
    }

    const max = this.#heap[0];
    this.#heap[0] = this.#heap.pop();
    this.#bubbleDown(0);

    return max.element;
  }

  isEmpty() {
    return this.#heap.length === 0;
  }
}

function part1(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(" "));

  let solution = 0;

  function isSame(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  x: for (const line of lines) {
    const scheme = line[0]
      .slice(1, -1)
      .split("")
      .map((x) => x === "#");
    const buttons = line.slice(1, -1).map((x) => {
      return x.slice(1, -1).split(",").map(Number);
    });

    const queue = [[new Array(scheme.length).fill(false), 0]];

    while (queue.length > 0) {
      const [l, iter] = queue.shift();

      for (const button of buttons) {
        const nl = l.slice();
        for (const i of button) {
          nl[i] = !nl[i];
        }
        if (isSame(nl, scheme)) {
          solution += iter + 1;
          continue x;
        }
        queue.push([nl, iter + 1]);
      }
    }
  }

  return solution;
}

function part2(input) {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(" "));
  let solution = 0;

  x: for (const line of lines) {
    const target = line[line.length - 1].slice(1, -1).split(",").map(Number);
    const buttons = line
      .slice(1, -1)
      .map((x) => x.slice(1, -1).split(",").map(Number));

    const n = target.length;
    const dist = new Map();
    const targetKey = target.join(",");

    const heuristic = (state) => {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += Math.max(0, target[i] - state[i]);
      }
      return sum;
    };

    const heap = new BinaryHeap();
    const initial = [0, new Array(n).fill(0)];
    heap.add(initial, 0);
    dist.set(initial.join(","), 0);

    // let d = 0;

    while (!heap.isEmpty()) {
      const [presses, state] = heap.pop();
      const key = state.join(",");

      // if (d++ > 1000) {
      //   d = 0;
      //   heap.keepBest(1000);
      // }

      if (dist.has(key) && dist.get(key) < presses) continue;

      z: for (const button of buttons) {
        const newState = [...state];
        for (const i of button) {
          newState[i]++;
          if (newState[i] > target[i]) {
            continue z;
          }
        }

        const newKey = newState.join(",");
        const newPresses = presses + 1;

        if (newKey === targetKey) {
          console.log(newPresses);
          solution += newPresses;
          continue x;
        }

        if (!dist.has(newKey) || dist.get(newKey) > newPresses) {
          dist.set(newKey, newPresses);
          heap.add([newPresses, newState], heuristic(newState));
        }
      }
    }
  }

  return solution;
}

await run(config, part1, part2);
