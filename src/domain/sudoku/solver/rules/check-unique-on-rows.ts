import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuGrid } from "../../contracts";
import { cloneGrid, defineValue } from "../../utils";

function checkUniqueOnRow(grid: SudokuGrid, row: number): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);
  const _row = _grid[row];

  const results: SudokuRuleResult[] = [];

  for (let v = 0; v < 9; v++) {
    const cellWithValue = _row.filter((cell) => Array.isArray(cell) && cell[v] === true);
    if (cellWithValue.length === 1) {
      const cell = cellWithValue[0];
      const cellIndex = _row.indexOf(cell);
      const value = v + 1;

      _grid = defineValue(_grid, [row, cellIndex], value);

      results.push({
        status: "success",
        rule: "check-unique-on-rows",
        grid: cloneGrid(_grid),
        message: `Number ${value} is unique in row ${row + 1}`,
        highlight: [[row, cellIndex]],
      });
    }
  }

  return results;
}

export const checkUniqueOnRows: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  let lastGridSolution = grid;
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const rowResults = checkUniqueOnRow(lastGridSolution, rowIndex);
    results.push(...rowResults);
    lastGridSolution = rowResults[rowResults.length - 1]?.grid ?? lastGridSolution;
  }

  return results;
};
