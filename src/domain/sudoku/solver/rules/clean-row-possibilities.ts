import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPossibilities, SudokuGrid, SudokuRow } from "../../contracts";
import { cloneGrid, rowHighlightGenerator } from "../../utils";

function checkRow(grid: SudokuGrid, row: number): SudokuRuleResult[] {
  const _grid = cloneGrid(grid);
  const _row = _grid[row];

  const numbers: number[] = [];
  for (let cell of _row) {
    if (typeof cell === "number") {
      numbers.push(cell);
    }
  }

  if (numbers.length === 0) {
    return [
      {
        status: "success",
        rule: "clean-row-possibilities",
        grid: _grid,
        message: `Row ${row + 1} have no numbers`,
        highlight: [...rowHighlightGenerator(row)],
      },
    ];
  }

  if (numbers.length === 9) {
    return [
      {
        status: "success",
        rule: "clean-row-possibilities",
        grid: _grid,
        message: `Row ${row + 1} have all numbers`,
        highlight: [...rowHighlightGenerator(row)],
      },
    ];
  }

  const results: SudokuRuleResult[] = [];
  for (let number of numbers) {
    let hasChangedSomeCell = false;
    for (let cell of _row) {
      if (typeof cell === "number") {
        continue;
      }

      (cell as SudokuCellPossibilities)[number - 1] = false;
      hasChangedSomeCell = true;
    }

    if (hasChangedSomeCell)
      results.push({
        status: "success",
        rule: "clean-row-possibilities",
        grid: cloneGrid(_grid),
        message: `Number ${number} cleaned from row ${row + 1}`,
        highlight: [[row, _row.indexOf(number)]],
      });
  }

  return results;
}

export const cleanRowPossibilities: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  let lastGridSolution = grid;
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const rowResults = checkRow(lastGridSolution, rowIndex);
    results.push(...rowResults);
    lastGridSolution = rowResults[rowResults.length - 1].grid;
  }

  return results;
};
