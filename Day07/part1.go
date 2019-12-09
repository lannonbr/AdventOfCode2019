package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

// Result of a pass
type Result struct {
	InputSignal  int
	PhaseSetting [5]int
}

type byInputSignal []Result

func (a byInputSignal) Len() int           { return len(a) }
func (a byInputSignal) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a byInputSignal) Less(i, j int) bool { return a[i].InputSignal < a[j].InputSignal }

func main() {
	file, err := os.Open("./input.txt")
	if err != nil {
		fmt.Println("error", err)
	}

	scanner := bufio.NewScanner(file)

	var program []int

	for scanner.Scan() {
		text := scanner.Text()
		nums := strings.Split(text, ",")
		for _, s := range nums {
			num, _ := strconv.Atoi(s)
			program = append(program, num)
		}
	}

	originalProgram := make([]int, len(program))

	copy(originalProgram, program)

	var phaseSetting [5]int
	inputSignal := 0
	numRun := 0

	phaseSettingPermutations := permutations([5]int{0, 1, 2, 3, 4})

	var results []Result

	for i := 0; i < len(phaseSettingPermutations); i++ {
		numRun = 0
		inputSignal = 0
		phaseSetting = phaseSettingPermutations[i]

		fmt.Printf("Phase Setting: %v\n", phaseSetting)

		for numRun < 5 {
			inputSignal = calculate(program, phaseSetting, inputSignal, numRun)

			numRun++
			copy(program, originalProgram)
		}
		results = append(results, Result{InputSignal: inputSignal, PhaseSetting: phaseSetting})
	}

	sort.Sort(byInputSignal(results))

	fmt.Println(results)
}

func permutations(arr [5]int) [][5]int {
	var helper func([5]int, int)
	res := [][5]int{}

	helper = func(arr [5]int, n int) {
		if n == 1 {
			var tmp [5]int
			copy(tmp[0:5], arr[0:5])
			res = append(res, tmp)
		} else {
			for i := 0; i < n; i++ {
				helper(arr, n-1)
				if n%2 == 1 {
					tmp := arr[i]
					arr[i] = arr[n-1]
					arr[n-1] = tmp
				} else {
					tmp := arr[0]
					arr[0] = arr[n-1]
					arr[n-1] = tmp
				}
			}
		}
	}
	helper(arr, len(arr))
	return res
}

func calculate(program []int, phaseSetting [5]int, inputSignal, numRun int) int {
	whichInput := 0
	i := 0
	var param1 int
	var param2 int

	for program[i] != 99 {
		fmt.Println("index", i)
		op, param1Mode, param2Mode := parseOpCodeAndModes(program[i])

		// 0 = position mode, if pos[i] === 4, go get value at index 4
		// 1 = immediate mode, if pos[i] === 4, use the literal value 4
		if param1Mode == 1 {
			param1 = program[i+1]
		} else {
			param1 = program[program[i+1]]
		}

		if param2Mode == 1 {
			param2 = program[i+2]
		} else {
			// It is out of bounds, set to -1 as we don't care (won't use it)
			if program[i+2] > len(program) {
				param2 = -1
			} else {
				param2 = program[program[i+2]]
			}
		}

		switch op {
		case 1:
			// Add
			program[program[i+3]] = param1 + param2
			i += 4
		case 2:
			// Multiply
			program[program[i+3]] = param1 * param2
			i += 4
		case 3:
			// Store
			if whichInput == 0 {
				program[program[i+1]] = phaseSetting[numRun]
				whichInput = 1
			} else {
				program[program[i+1]] = inputSignal
				whichInput = 0
			}
			i += 2
		case 4:
			// Output
			fmt.Printf("[OUTPUT] %d\n", program[program[i+1]])
			inputSignal = program[program[i+1]]
			i += 2
		case 5:
			// Jump if non-zero
			if param1 != 0 {
				i = param2
			} else {
				i += 3
			}
		case 6:
			// jump if 0
			if param1 == 0 {
				i = param2
			} else {
				i += 3
			}
		case 7:
			// less-than
			if param1 < param2 {
				program[program[i+3]] = 1
			} else {
				program[program[i+3]] = 0
			}
			i += 4
		case 8:
			// equals
			if param1 == param2 {
				program[program[i+3]] = 1
			} else {
				program[program[i+3]] = 0
			}
			i += 4
		}
	}

	return inputSignal
}

func parseOpCodeAndModes(num int) (int, int, int) {
	numStr := fmt.Sprintf("%04d", num)

	op, _ := strconv.Atoi(numStr[2:])
	param1Mode, _ := strconv.Atoi(numStr[1:2])
	param2Mode, _ := strconv.Atoi(numStr[0:1])

	return op, param1Mode, param2Mode
}
