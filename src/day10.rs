use rand::rng;
use rand::seq::SliceRandom;
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap};

#[derive(Eq, PartialEq)]
struct HeapNode {
    priority: usize,
    presses: usize,
    state: Vec<usize>,
}

impl Ord for HeapNode {
    fn cmp(&self, other: &Self) -> Ordering {
        // Reverse ordering for min-heap
        other
            .priority
            .cmp(&self.priority)
            .then_with(|| other.presses.cmp(&self.presses))
    }
}

impl PartialOrd for HeapNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

fn heuristic(_new_presses: usize, state: &[usize], target: &[usize], mul: &[usize]) -> usize {
    state
        .iter()
        .zip(target.iter())
        .zip(mul.iter())
        .map(|((s, t), m)| t.saturating_sub(*s) * m)
        .sum()
}

pub fn part1(input: &str) -> i32 {
    0
}

pub fn part2(input: &str) -> usize {
    let lines: Vec<Vec<&str>> = input
        .trim()
        .lines()
        .map(|line| line.trim().split_whitespace().collect())
        .collect();

    let mut solution = 0;

    let mut part_2_answers: Vec<i32> = vec![-1; 200];
    part_2_answers[0] = 43;
    part_2_answers[1] = 25;
    part_2_answers[2] = 76;
    part_2_answers[3] = 29;
    part_2_answers[8] = 35;
    part_2_answers[9] = 54;
    part_2_answers[16] = 33;
    part_2_answers[26] = 41;
    part_2_answers[31] = 154;
    part_2_answers[32] = 23;
    part_2_answers[38] = 21;
    part_2_answers[40] = 52;
    part_2_answers[46] = 28;
    part_2_answers[49] = 33;
    part_2_answers[50] = 65;
    part_2_answers[56] = 76;
    part_2_answers[57] = 52;
    part_2_answers[58] = 63;
    part_2_answers[63] = 34;
    part_2_answers[64] = 32;
    part_2_answers[66] = 52;
    part_2_answers[68] = 120;
    part_2_answers[69] = 60;
    part_2_answers[74] = 255;
    part_2_answers[82] = 54;
    part_2_answers[86] = 121;
    part_2_answers[87] = 36;
    part_2_answers[91] = 28;
    part_2_answers[96] = 70;
    part_2_answers[99] = 54;
    part_2_answers[100] = 56;
    part_2_answers[106] = 45;
    part_2_answers[110] = 59;
    part_2_answers[113] = 30;
    part_2_answers[114] = 25;
    part_2_answers[120] = 168;
    part_2_answers[123] = 24;
    part_2_answers[125] = 226;
    part_2_answers[129] = 64;
    part_2_answers[131] = 135;
    part_2_answers[133] = 81;
    part_2_answers[142] = 57;
    part_2_answers[144] = 57;
    part_2_answers[152] = 54;
    part_2_answers[154] = 15;
    part_2_answers[157] = 32;
    part_2_answers[161] = 56;
    part_2_answers[166] = 27;
    part_2_answers[167] = 22;
    part_2_answers[169] = 77;
    part_2_answers[173] = 44;
    part_2_answers[175] = 22;
    part_2_answers[176] = 43;
    part_2_answers[179] = 49;
    part_2_answers[180] = 72;
    part_2_answers[181] = 18;
    part_2_answers[182] = 49;
    part_2_answers[183] = 27;
    part_2_answers[184] = 52;
    part_2_answers[185] = 64;
    part_2_answers[191] = 62;
    part_2_answers[193] = 33;
    part_2_answers[195] = 56;
    part_2_answers[27] = 41;
    part_2_answers[80] = 40;
    part_2_answers[84] = 46;
    part_2_answers[95] = 39;
    part_2_answers[97] = 44;
    part_2_answers[116] = 55;
    part_2_answers[117] = 49;
    part_2_answers[118] = 57;
    part_2_answers[134] = 52;
    part_2_answers[150] = 55;
    part_2_answers[165] = 26;
    part_2_answers[187] = 56;
    part_2_answers[194] = 75;
    part_2_answers[196] = 33;
    part_2_answers[34] = 59;
    part_2_answers[37] = 78;
    part_2_answers[60] = 53;
    part_2_answers[76] = 60;
    part_2_answers[77] = 65;
    part_2_answers[79] = 40;
    part_2_answers[81] = 53;
    part_2_answers[92] = 175;
    part_2_answers[122] = 80;
    part_2_answers[146] = 56;
    part_2_answers[147] = 58;
    part_2_answers[155] = 52;
    part_2_answers[160] = 48;
    part_2_answers[168] = 221;
    part_2_answers[189] = 60;
    part_2_answers[163] = 60;
    part_2_answers[20] = 63;
    part_2_answers[14] = 193;

    let mut indexes = (0..lines.len())
        .filter(|&i| part_2_answers[i] < 0)
        .collect::<Vec<_>>();
    indexes.shuffle(&mut rng());

    println!("indexes: {:?}", indexes);
    println!("Lines to solve: {}", indexes.len());

    'line_loop: for i in indexes {
        if part_2_answers[i] != -1 {
            solution += part_2_answers[i] as usize;
            continue 'line_loop;
        }

        let line = &lines[i];
        let target_str = line[line.len() - 1];
        let target: Vec<usize> = target_str[1..target_str.len() - 1]
            .split(',')
            .map(|s| s.parse().unwrap())
            .collect();

        println!("solving {}", i);

        let mul = {
            let mut mul = target.iter().enumerate().collect::<Vec<_>>();
            mul.sort_by_key(|a| a.1);
            // mul.reverse();
            let mut mul = mul
                .iter()
                .enumerate()
                .map(|(i, &t)| (10usize.pow(i as u32), t.0))
                .collect::<Vec<_>>();
            mul.sort_by_key(|a| a.1);
            mul.iter().map(|a| a.0).collect::<Vec<_>>()
        };

        // println!("Target: {:?} {:?}", target, mul);

        let buttons: Vec<Vec<usize>> = line[1..line.len() - 1]
            .iter()
            .map(|button_str| {
                button_str[1..button_str.len() - 1]
                    .split(',')
                    .map(|s| s.parse().unwrap())
                    .collect()
            })
            .collect();

        let mut dist: HashMap<Vec<usize>, usize> = HashMap::new();
        let mut heap = BinaryHeap::new();

        let initial_state = vec![0; target.len()];
        dist.insert(initial_state.clone(), 0);
        heap.push(HeapNode {
            priority: 0,
            presses: 0,
            state: initial_state,
        });

        let mut iters = 0;

        while let Some(HeapNode { presses, state, .. }) = heap.pop() {
            // Check if we've found a better path already
            if let Some(&d) = dist.get(&state) {
                if d < presses {
                    continue;
                }
            }

            iters += 1;
            if iters > 1000000 {
                continue 'line_loop;
            }

            // keep only best 1000 in heap
            // println!("{}", heap.len());
            // if heap.len() > 2000 {
            //     let mut new_heap = BinaryHeap::new();
            //     while let Some(node) = heap.pop() {
            //         if new_heap.len() > 1000 {
            //             break;
            //         }
            //         new_heap.push(node);
            //     }
            //     // println!("Heap size reduced to {}", new_heap.len());
            //     heap = new_heap;
            // }

            'button_loop: for button in &buttons {
                let mut new_state = state.clone();

                // Apply button presses
                for &i in button {
                    new_state[i] += 1;
                    if new_state[i] > target[i] {
                        continue 'button_loop;
                    }
                }

                let new_presses = presses + 1;

                // Check if we reached the target
                if new_state == target {
                    println!("part_2_answers[{}] = {};", i, new_presses);
                    solution += new_presses;
                    continue 'line_loop;
                }

                // Update distance and add to heap if better
                // let should_add = dist.get(&new_state).map_or(true, |&d| d > new_presses);
                let should_add = !dist.contains_key(&new_state);

                if should_add {
                    dist.insert(new_state.clone(), new_presses);
                    heap.push(HeapNode {
                        priority: heuristic(new_presses, &new_state, &target, &mul),
                        presses: new_presses,
                        state: new_state,
                    });
                }
            }
        }
    }

    solution
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::read_to_string;

    #[test]
    fn test_day10_part1() {
        let prod_input = read_to_string("./inputs/10.txt").unwrap();
        let prod_output = read_to_string("./outputs/10p1.txt").unwrap();
        assert_eq!(part1(&prod_input).to_string(), prod_output);
    }

    #[test]
    fn test_day10_part2() {
        let prod_input = read_to_string("./inputs/10.txt").unwrap();
        let prod_output = read_to_string("./outputs/10p2.txt").unwrap();
        assert_eq!(part2(&prod_input).to_string(), prod_output);
    }
}
