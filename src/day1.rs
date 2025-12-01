pub fn part1(input: &str) -> i32 {
    let turns = parse(&input);
    let mut pos = 50;
    let mut zeros = 0;

    for turn in turns {
        pos = (pos + turn) % 100;
        if pos == 0 {
            zeros += 1;
        }
    }

    zeros
}

pub fn part2(input: &str) -> i32 {
    let turns = parse(&input);
    let mut pos = 50;
    let mut zeros = 0;

    for turn in turns {
        let step = if turn > 0 { -1 } else { 1 };
        for _ in 0..turn.abs() {
            pos += step;
            if pos < 0 {
                pos = 99;
            }
            if pos > 99 {
                pos = 0;
            }
            if pos == 0 {
                zeros += 1;
            }
        }
    }

    zeros
}

fn parse(input: &str) -> Vec<i32> {
    let mut turns = Vec::with_capacity(4069);
    let mut turn = 0;
    let mut mul = 1;

    for c in input.bytes() {
        match c {
            b'R' => mul = 1,
            b'L' => mul = -1,
            b'0'..=b'9' => {
                turn *= 10;
                turn += (c - b'0') as i32;
            }
            b'\n' => {
                turns.push(turn * mul);
                turn = 0;
            }
            _ => {}
        }
    }

    if turn != 0 {
        turns.push(turn * mul);
    }

    turns
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::read_to_string;

    #[test]
    fn test_day1_part1() {
        let prod_input = read_to_string("./inputs/1.txt").unwrap();
        let prod_output = read_to_string("./outputs/1p1.txt").unwrap();
        assert_eq!(part1(&prod_input).to_string(), prod_output);
    }

    #[test]
    fn test_day1_part2() {
        let prod_input = read_to_string("./inputs/1.txt").unwrap();
        let prod_output = read_to_string("./outputs/1p2.txt").unwrap();
        assert_eq!(part2(&prod_input).to_string(), prod_output);
    }
}
