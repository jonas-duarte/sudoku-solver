import { SudokuRule, SudokuRuleResult } from "..";
import { SudokuGrid } from "../../contracts";
import { cloneGrid, defineValue } from "../../utils";

function checkUniqueOnColumn(grid: SudokuGrid, column: number): SudokuRuleResult[] {
  let _grid = cloneGrid(grid);
  const _column = _grid.map((row) => row[column]);

  const results: SudokuRuleResult[] = [];

  for (let v = 0; v < 9; v++) {
    const cellsWithValue = _column.filter((cell) => Array.isArray(cell) && cell[v] === true);

    if (cellsWithValue.length === 1) {
      const cell = cellsWithValue[0];
      const cellIndex = _column.indexOf(cell);
      const value = v + 1;

      _grid = defineValue(_grid, [cellIndex, column], value);

      results.push({
        status: "success",
        rule: "check-unique-on-columns",
        grid: cloneGrid(_grid),
        message: `Number ${value} is unique in column ${column + 1}`,
        highlight: [[cellIndex, column]],
      });
    }
  }

  return results;
}

export const checkUniqueOnColumns: SudokuRule = (grid: SudokuGrid) => {
  const results: SudokuRuleResult[] = [];

  let lastGridSolution = grid;
  for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
    const columnResults = checkUniqueOnColumn(lastGridSolution, columnIndex);
    results.push(...columnResults);
    lastGridSolution = columnResults[columnResults.length - 1]?.grid ?? lastGridSolution;
  }

  return results;
};
