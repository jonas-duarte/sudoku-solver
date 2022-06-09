import { SudokuCellPosition, SudokuCellPossibilities } from "../../contracts";
import { SudokuRuleResult } from "..";
import { SudokuRule } from "..";
import { SudokuGrid } from "../../contracts";
import { cloneGrid, defineValue } from "../../utils";

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

      const value = cell.findIndex((p) => p) + 1;

      _grid = defineValue(_grid, [row, column], value);

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

export const defineUniqueValues: SudokuRule = (grid: SudokuGrid) => {
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
