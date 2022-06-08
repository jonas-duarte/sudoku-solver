import { SudokuCellPosition, SudokuCellPossibilities } from "../../contracts";
import { SudokuRuleResult } from "..";
import { SudokuRule } from "..";
import { SudokuGrid } from "../../contracts";
import { cloneGrid } from "../../utils";

function cleanRow(grid: SudokuGrid, row: number, number: number): SudokuGrid {
  for (let column = 0; column < 9; column++) {
    const cell = grid[row][column];

    if (!Array.isArray(cell)) {
      continue;
    }

    (cell as SudokuCellPossibilities)[number - 1] = false;
  }

  return grid;
}

function cleanColumn(grid: SudokuGrid, column: number, number: number): SudokuGrid {
  for (let row = 0; row < 9; row++) {
    const cell = grid[row][column];

    if (!Array.isArray(cell)) {
      continue;
    }

    (cell as SudokuCellPossibilities)[number - 1] = false;
  }

  return grid;
}

function cleanBlock(grid: SudokuGrid, position: SudokuCellPosition, number: number): SudokuGrid {
  const blockRow = Math.floor(position[0] / 3);
  const columnRow = Math.floor(position[1] / 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const row = blockRow * 3 + i;
      const column = columnRow * 3 + j;
      const cell = grid[row][column];

      if (!Array.isArray(cell)) {
        continue;
      }

      (cell as SudokuCellPossibilities)[number - 1] = false;
    }
  }

  return grid;
}

function solveNextUniquePossibility(grid: SudokuGrid): SudokuRuleResult | null {
  let _grid = cloneGrid(grid);

  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const cell = _grid[row][column];

      if (!Array.isArray(cell)) {
        continue;
      }

      if (cell.filter((p) => p).length !== 1) {
        continue;
      }

      const number = cell.findIndex((p) => p);
      _grid[row][column] = number + 1;

      _grid = cleanRow(_grid, row, number + 1);
      _grid = cleanColumn(_grid, column, number + 1);
      _grid = cleanBlock(_grid, [row, column], number + 1);

      return {
        status: "success",
        rule: "solve-next-unique-possibility",
        grid: _grid,
        message: `Cell [${row + 1}, ${column + 1}] has unique possibility`,
        highlight: [[row, column]],
      };
    }
  }

  return null;
}

export const defineUniquePossibilities: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  while (true) {
    const result = solveNextUniquePossibility(results[results.length - 1]?.grid ?? grid);
    if (!result) {
      break;
    }
    results.push(result);
  }

  return results;
};
