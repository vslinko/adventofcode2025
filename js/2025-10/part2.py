import z3


def part2(input_text):
    lines = input_text.strip().split("\n")
    solution = 0

    for line in lines:
        parts = line.strip().split(" ")
        buttons = [[int(x) for x in part[1:-1].split(",")] for part in parts[1:-1]]
        targets = [int(x) for x in parts[-1][1:-1].split(",")]

        opt = z3.Optimize()

        presses = [z3.Int(f"b{i}") for i in range(len(buttons))]

        # количество нажатий не может быть меньше нуля
        for p in presses:
            opt.add(p >= 0)

        # сумма нажатий на все кнопки, которые меняют вольтаж конкретной машины,
        # должна быть равна целевому вольтажу этой машины
        for t, target in enumerate(targets):
            target_presses = 0
            for b, button in enumerate(buttons):
                if t in button:
                    target_presses += presses[b]
            opt.add(target_presses == target)

        # минимизируем общее количество нажатий
        total_presses = z3.Sum(presses)
        opt.minimize(total_presses)

        if opt.check() != z3.sat:
            raise ValueError("No solution exists")

        solution += opt.model().eval(total_presses).as_long()

    return solution


print(
    part2("""[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}""")
)

with open("input.txt", "r") as f:
    print(part2(f.read()))
