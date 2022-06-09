import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuCellPossibilities, SudokuGrid, SudokuRow } from "../../contracts";
import { cloneGrid, columnHighlightGenerator } from "../../utils";

function checkColumn(grid: SudokuGrid, column: number): SudokuRuleResult[] {
  const _grid = cloneGrid(grid);
  const _column = _grid.map((row: SudokuRow) => row[column]);

  const numbers: number[] = [];
  for (let cell of _column) {
    if (typeof cell === "number") {
      numbers.push(cell);
    }
  }

  if (numbers.length === 0) {
    return [];
  }

  if (numbers.length === 9) {
    return [];
  }

  const results: SudokuRuleResult[] = [];
  for (let number of numbers) {
    let hasChangedSomeCell = false;
    for (let cell of _column) {
      if (typeof cell === "number") {
        continue;
      }

      if (!(cell as SudokuCellPossibilities)[number - 1]) {
        continue;
      }

      (cell as SudokuCellPossibilities)[number - 1] = false;
      hasChangedSomeCell = true;
    }

    if (hasChangedSomeCell)
      results.push({
        status: "success",
        rule: "clean-column-possibilities",
        grid: cloneGrid(_grid),
        message: `Number ${number} cleaned from column ${column + 1}`,
        highlight: [[_column.indexOf(number), column]],
      });
  }

  return results;
}

export const cleanColumns: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  let lastGridSolution = grid;
  for (let columnIndex = 0; columnIndex < grid.length; columnIndex++) {
    const columnResults = checkColumn(lastGridSolution, columnIndex);
    results.push(...columnResults);
    lastGridSolution = columnResults[columnResults.length - 1]?.grid ?? lastGridSolution;
  }

  return results;
};
